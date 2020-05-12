import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import {Link} from 'react-router-dom';
import {getProducts} from './apiCore';
import Card from './Card';
import {getCart, removeItem} from './cartHelpers';
import Checkout from './Checkout';


const Cart = () => {
	const [items, setItems] = useState([]);
	const [run, setRun] = useState(false);

	useEffect(() => {
		setItems(getCart())
	}, [run]);

	const showItems = items => {
		return (
			<div>
				<h2>Total: {`${items.length}`} items</h2>
				<hr />
				{items.map((product, i) => (<Card key={i} product={product} showAddtoCart={false} cartUpdate={true} showRemoveButton={true} setRun={setRun} run={run} />))}
			</div>
			);
	};

	const noItems = () => (
		<h2>
		Cart is empty <br /> <Link to="/shop">Back to shop</Link>
		</h2>
	);

	return (
	<Layout title="My Cart" description="Confirm items and proceed to checkout" className="container-fluid">
	<div className="row">
		<div className="col-6">
		{items.length > 0 ? showItems(items) : noItems()}
		</div>

		<div className="col-6">
				<h2 className="mb-4">Summary</h2>
				<hr />
				<Checkout products={items} />
		</div>
	</div>
	</Layout>
	);
};

export default Cart;