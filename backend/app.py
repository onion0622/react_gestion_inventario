from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.models import db, Product, ContactMessage
from backend.service import fetch_all_products, add_product, modify_product, remove_product, fetch_all_contact_messages, add_contact_message, remove_contact_message

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
CORS(app)  # Permite peticiones desde React

# Rutas API para productos
@app.route('/api/products', methods=['GET'])
def get_products():
    products = fetch_all_products()
    return jsonify([product.to_dict() for product in products])

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    product = add_product(data)
    return jsonify(product.to_dict()), 201

@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    data = request.get_json()
    product = modify_product(id, data)
    return jsonify(product.to_dict())

@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    remove_product(id)
    return '', 204

# Rutas API para mensajes de contacto
@app.route('/api/contact-messages', methods=['GET'])
def get_contact_messages():
    messages = fetch_all_contact_messages()
    return jsonify([message.to_dict() for message in messages])

@app.route('/api/contact-messages', methods=['POST'])
def create_contact_message():
    data = request.get_json()
    message = add_contact_message(data)
    return jsonify(message.to_dict()), 201

@app.route('/api/contact-messages/<int:id>', methods=['DELETE'])
def delete_contact_message(id):
    remove_contact_message(id)
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Agregar datos de ejemplo si no existen
        if Product.query.count() == 0:
            sample_products = [
                Product(name='Laptop Dell XPS', quantity=15, price=899.99, min_stock=5),
                Product(name='Mouse Inalámbrico', quantity=3, price=29.99, min_stock=10),
                Product(name='Teclado Mecánico', quantity=25, price=79.99, min_stock=8),
                Product(name='Monitor 24"', quantity=12, price=199.99, min_stock=6)
            ]
            for product in sample_products:
                db.session.add(product)
            db.session.commit()
    
    app.run(debug=True, port=5000)


    ## Activar entorno virtual :v : venv\Scripts\activate
