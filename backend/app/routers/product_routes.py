import json
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import require_admin, require_staff

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")

supabase_client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"[Product Routes] Supabase init note: {e}")

def sync_product_to_supabase(action: str, prod_data: dict):
    if not supabase_client:
        return
    try:
        if action in ("create", "update", "upsert"):
            supabase_client.table("products").upsert(prod_data).execute()
            print(f"[Supabase Sync] Product {prod_data.get('id')} synced successfully.")
        elif action == "delete":
            supabase_client.table("products").delete().eq("id", prod_data.get("id")).execute()
            print(f"[Supabase Sync] Product {prod_data.get('id')} deleted successfully.")
    except Exception as e:
        print(f"[Supabase Sync Note] {action} note: {e}")

router = APIRouter(prefix="/api", tags=["Products & Categories"])

# --- Categories ---
@router.get("/categories", response_model=List[schemas.CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).filter(models.Category.is_active == True).all()

@router.post("/categories", response_model=schemas.CategoryResponse)
def create_category(
    cat_data: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    existing = db.query(models.Category).filter(models.Category.id == cat_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category ID already exists")

    new_cat = models.Category(
        id=cat_data.id.lower().strip(),
        name=cat_data.name,
        description=cat_data.description or "",
        image=cat_data.image or ""
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.patch("/categories/{cat_id}", response_model=schemas.CategoryResponse)
def update_category(
    cat_id: str,
    cat_data: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    if cat_data.name is not None:
        cat.name = cat_data.name
    if cat_data.description is not None:
        cat.description = cat_data.description
    if cat_data.image is not None:
        cat.image = cat_data.image
    if cat_data.is_active is not None:
        cat.is_active = cat_data.is_active

    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/categories/{cat_id}")
def delete_category(
    cat_id: str,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    
    cat.is_active = False # soft delete
    db.commit()
    return {"success": True, "message": f"Category {cat.name} deleted"}

# --- Products ---
def format_product_response(p: models.Product) -> schemas.ProductResponse:
    try:
        allergens = json.loads(p.allergens_json) if p.allergens_json else []
    except Exception:
        allergens = []

    try:
        sizes = json.loads(p.sizes_json) if p.sizes_json else []
        customization = {"sizes": sizes} if sizes else None
    except Exception:
        customization = None

    try:
        recipe = json.loads(p.recipe_json) if p.recipe_json else []
    except Exception:
        recipe = []

    return schemas.ProductResponse(
        id=p.id,
        name=p.name,
        category=p.category.name if p.category else p.category_id,
        category_id=p.category_id,
        price=p.price,
        cost_price=p.cost_price or 0.0,
        image=p.image,
        description=p.description,
        shortDescription=p.short_description,
        allergens=allergens,
        badge=p.badge,
        is_featured=p.is_featured,
        rating=p.rating,
        customization=customization,
        in_stock=p.in_stock,
        stock_quantity=p.stock_quantity or 0,
        recipe=recipe
    )

@router.get("/products", response_model=List[schemas.ProductResponse])
def get_products(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    search: Optional[str] = Query(None, description="Search term in product name or description"),
    sort: Optional[str] = Query("featured", description="Sort by: featured, price-low, price-high, rating"),
    in_stock_only: Optional[bool] = Query(False),
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)

    if category and category != "all":
        query = query.filter(models.Product.category_id == category)

    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.Product.name.ilike(search_fmt)) | 
            (models.Product.description.ilike(search_fmt)) |
            (models.Product.short_description.ilike(search_fmt))
        )

    if in_stock_only:
        query = query.filter(models.Product.in_stock == True)

    products = query.all()

    # Sync: If local DB has no products or out of sync, check Supabase
    if not products and supabase_client:
        try:
            sup_res = supabase_client.table("products").select("*").execute()
            if sup_res.data:
                for item in sup_res.data:
                    existing = db.query(models.Product).filter(models.Product.id == item["id"]).first()
                    if not existing:
                        p = models.Product(
                            id=item["id"],
                            name=item.get("name", ""),
                            category_id=item.get("category_id", "cakes"),
                            price=float(item.get("price", 0.0)),
                            cost_price=float(item.get("cost_price", 0.0)),
                            image=item.get("image", ""),
                            description=item.get("description", ""),
                            short_description=item.get("short_description", ""),
                            allergens_json=item.get("allergens_json", "[]"),
                            badge=item.get("badge", ""),
                            is_featured=bool(item.get("is_featured", False)),
                            rating=float(item.get("rating", 5.0)),
                            sizes_json=item.get("sizes_json", "[]"),
                            in_stock=bool(item.get("in_stock", True)),
                            stock_quantity=int(item.get("stock_quantity", 50)),
                            recipe_json=item.get("recipe_json", "[]")
                        )
                        db.add(p)
                db.commit()
                products = query.all()
        except Exception as e:
            print(f"[Supabase Auto-Sync Note] {e}")

    result = [format_product_response(p) for p in products]

    if sort == "price-low":
        result.sort(key=lambda x: x.price)
    elif sort == "price-high":
        result.sort(key=lambda x: x.price, reverse=True)
    elif sort == "rating":
        result.sort(key=lambda x: x.rating, reverse=True)

    return result

@router.post("/products", response_model=schemas.ProductResponse)
def create_product(
    prod_data: schemas.ProductCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    existing = db.query(models.Product).filter(models.Product.id == prod_data.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Product with ID '{prod_data.id}' already exists")

    new_prod = models.Product(
        id=prod_data.id,
        name=prod_data.name,
        category_id=prod_data.category_id,
        price=prod_data.price,
        cost_price=prod_data.cost_price or (prod_data.price * 0.4),
        image=prod_data.image or "",
        description=prod_data.description or "",
        short_description=prod_data.short_description or (prod_data.description[:100] if prod_data.description else ""),
        allergens_json=json.dumps(prod_data.allergens or []),
        badge=prod_data.badge or "",
        is_featured=prod_data.is_featured or False,
        rating=prod_data.rating or 5.0,
        sizes_json=json.dumps(prod_data.sizes or []),
        in_stock=prod_data.in_stock if prod_data.in_stock is not None else True,
        stock_quantity=prod_data.stock_quantity if prod_data.stock_quantity is not None else 50,
        recipe_json=json.dumps([r.model_dump() if hasattr(r, 'model_dump') else r for r in (prod_data.recipe or [])])
    )

    db.add(new_prod)
    db.commit()
    db.refresh(new_prod)

    sync_product_to_supabase("upsert", {
        "id": new_prod.id,
        "name": new_prod.name,
        "category_id": new_prod.category_id,
        "price": new_prod.price,
        "cost_price": new_prod.cost_price or 0.0,
        "image": new_prod.image or "",
        "description": new_prod.description or "",
        "short_description": new_prod.short_description or "",
        "allergens_json": new_prod.allergens_json or "[]",
        "badge": new_prod.badge or "",
        "is_featured": new_prod.is_featured or False,
        "rating": new_prod.rating or 5.0,
        "sizes_json": new_prod.sizes_json or "[]",
        "in_stock": new_prod.in_stock,
        "stock_quantity": new_prod.stock_quantity or 50,
        "recipe_json": new_prod.recipe_json or "[]"
    })

    return format_product_response(new_prod)

@router.get("/products/{product_id}", response_model=schemas.ProductResponse)
def get_product_detail(product_id: str, db: Session = Depends(get_db)):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return format_product_response(p)

@router.patch("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: str,
    prod_data: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    if prod_data.name is not None:
        p.name = prod_data.name
    if prod_data.category_id is not None:
        p.category_id = prod_data.category_id
    if prod_data.price is not None:
        p.price = prod_data.price
    if prod_data.cost_price is not None:
        p.cost_price = prod_data.cost_price
    if prod_data.image is not None:
        p.image = prod_data.image
    if prod_data.description is not None:
        p.description = prod_data.description
    if prod_data.short_description is not None:
        p.short_description = prod_data.short_description
    if prod_data.allergens is not None:
        p.allergens_json = json.dumps(prod_data.allergens)
    if prod_data.badge is not None:
        p.badge = prod_data.badge
    if prod_data.is_featured is not None:
        p.is_featured = prod_data.is_featured
    if prod_data.rating is not None:
        p.rating = prod_data.rating
    if prod_data.sizes is not None:
        p.sizes_json = json.dumps(prod_data.sizes)
    if prod_data.in_stock is not None:
        p.in_stock = prod_data.in_stock
    if prod_data.stock_quantity is not None:
        p.stock_quantity = prod_data.stock_quantity
    if prod_data.recipe is not None:
        p.recipe_json = json.dumps([r.model_dump() if hasattr(r, 'model_dump') else r for r in prod_data.recipe])

    db.commit()
    db.refresh(p)

    sync_product_to_supabase("upsert", {
        "id": p.id,
        "name": p.name,
        "category_id": p.category_id,
        "price": p.price,
        "cost_price": p.cost_price or 0.0,
        "image": p.image or "",
        "description": p.description or "",
        "short_description": p.short_description or "",
        "allergens_json": p.allergens_json or "[]",
        "badge": p.badge or "",
        "is_featured": p.is_featured or False,
        "rating": p.rating or 5.0,
        "sizes_json": p.sizes_json or "[]",
        "in_stock": p.in_stock,
        "stock_quantity": p.stock_quantity or 50,
        "recipe_json": p.recipe_json or "[]"
    })

    return format_product_response(p)

@router.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    p = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    prod_id = p.id
    prod_name = p.name
    db.delete(p)
    db.commit()

    sync_product_to_supabase("delete", {"id": prod_id})

    return {"success": True, "message": f"Product '{prod_name}' deleted successfully"}
