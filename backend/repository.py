from backend.models import Product, ContactMessage, db

def get_all_products():
    return Product.query.all()

def get_product_by_id(product_id):
    return Product.query.get_or_404(product_id)

def create_product(data):
    product = Product(
        name=data['name'],
        quantity=data['quantity'],
        price=data['price'],
        min_stock=data.get('minStock', 5)
    )
    db.session.add(product)
    db.session.commit()
    return product

def update_product(product_id, data):
    product = get_product_by_id(product_id)
    product.name = data['name']
    product.quantity = data['quantity']
    product.price = data['price']
    product.min_stock = data.get('minStock', 5)
    db.session.commit()
    return product

def delete_product(product_id):
    product = get_product_by_id(product_id)
    db.session.delete(product)
    db.session.commit()

# Operaciones CRUD para mensajes de contacto
def get_all_contact_messages():
    return ContactMessage.query.all()

def get_contact_message_by_id(message_id):
    return ContactMessage.query.get_or_404(message_id)

def create_contact_message(data):
    message = ContactMessage(
        name=data['name'],
        email=data['email'],
        message=data['message']
    )
    db.session.add(message)
    db.session.commit()
    return message

def delete_contact_message(message_id):
    message = get_contact_message_by_id(message_id)
    db.session.delete(message)
    db.session.commit()
