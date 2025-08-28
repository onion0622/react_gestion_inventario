from .repository import get_all_products, create_product, update_product, delete_product, get_all_contact_messages, create_contact_message, delete_contact_message

def fetch_all_products():
    return get_all_products()

def add_product(data):
    return create_product(data)

def modify_product(product_id, data):
    return update_product(product_id, data)

def remove_product(product_id):
    delete_product(product_id)

# Servicios para mensajes de contacto
def fetch_all_contact_messages():
    return get_all_contact_messages()

def add_contact_message(data):
    return create_contact_message(data)

def remove_contact_message(message_id):
    delete_contact_message(message_id)
