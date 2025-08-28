from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)  # Permite peticiones desde React

# Modelo de Producto
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    min_stock = db.Column(db.Integer, default=5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'price': self.price,
            'minStock': self.min_stock,
            'created_at': self.created_at.isoformat()
        }

# Rutas API
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

@app.route('/api/products', methods=['POST'])
def create_product():
    data = request.get_json()
    product = Product(
        name=data['name'],
        quantity=data['quantity'],
        price=data['price'],
        min_stock=data.get('minStock', 5)
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@app.route('/api/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    
    product.name = data['name']
    product.quantity = data['quantity']
    product.price = data['price']
    product.min_stock = data.get('minStock', 5)
    
    db.session.commit()
    return jsonify(product.to_dict())

@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
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