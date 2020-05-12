import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import {addItem, updateItem, removeItem} from './cartHelpers';

const Card = ({product, showViewProductButton = true, showAddtoCart= true, cartUpdate= false, showRemoveButton = false, setRun = f => f, run = undefined}) => {
	const showViewButton = (showViewProductButton) => {
		return (
				showViewProductButton && (<button className="btn btn-outline-primary mt-2 mb-2 mr-2">View Info</button>)
			);
	};

	const [redirect, setRedirect] = useState(false);
	const [count, setCount] = useState(product.count);

	const addToCart = () => {
		addItem(product, setRedirect(true));
	};

	const shouldRedirect = redirect => {
		if (redirect) {
			return <Redirect to="/cart" />
		}
	}

	const showCartButton = (showAddtoCart) => {
		return (showAddtoCart && (
			<button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">Add to cart</button>
			)
		);
	};

	const showRemove = (showRemoveButton) => {
		return (showRemoveButton && (
			<button onClick={() => {removeItem(product._id); setRun(!run);}} className="btn btn-outline-danger mt-2 mb-2">Remove Item</button>
			)
		);
	};

	const showNumber = (quantity) => {
		return quantity > 0 ? <span className="badge badge-primary badge-pill">In Stock</span> : <span className="badge badge-primary badge-pill">Out of Stock</span>
	};



	const handleChange = productId => event => {
		setRun(!run);
		setCount(event.target.value < 1 ? 1 : event.target.value);
		if(event.target.value >= 1) {
			updateItem(productId, event.target.value);
		}
	};

	const showCartUpdate = cartUpdate => {
		return cartUpdate && 
		<div>
			<div className="input-group mb-3">
				<div className="input-group-prepend">
					<span className="input-group-text">Adjust Quantity</span>
				</div>
				<input type="number" className="form-control" value={count} onChange={handleChange(product._id)}/>
			</div>
		</div>;
	};

	return (
		
			<div className="card">
				<div className="card-header name">{product.name}</div>
				<div className="card-body">
				{shouldRedirect(redirect)}
					<ShowImage item={product} url="product" />
					<p className="lead mt-2">{product.description.substring(0, 100)}</p>
					<p className="black-9">${product.price}</p>
					<p className="black-8">Category: {product.category && product.category.name}</p>
					<p className="black-8">
						Added {moment(product.createdAt).fromNow()}
					</p>
					{showNumber(product.quantity)}
					<br />
					<Link to={`/product/${product._id}`}>
						{showViewButton(showViewProductButton)}
						
					</Link>
					
					
					{showCartButton(showAddtoCart)}
					{showRemove(showRemoveButton)}
					{showCartUpdate(cartUpdate)}
				</div>
			</div>
		
	);
};

export default Card;