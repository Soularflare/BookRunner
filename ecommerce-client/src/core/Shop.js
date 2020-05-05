import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from './Checkbox';
import {prices} from './Prices';
import RadioBox from './RadioBox';


const Shop = () => {
	const [myFilters, setMyFilters] = useState({
		filters: {category: [], price: []}
	});
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(false);
	const [limit, setLimit] = useState(6);
	const [skip, setSkip] = useState(0);
	const [size, setSize] = useState(0);
	const [filteredResults, setFilteredResults] = useState([]);
	const init = () => {
		getCategories().then(data => {
			if(data.error) {
				setError(data.error);
			} else {
				setCategories(data);
			}
		});
	};

	useEffect(() => {
		init();
		loadFilterResult(skip, limit, myFilters.filters);
	}, []);

	const handleFilters = (filters, filterBy) => {
		const newFilters = {...myFilters};
		newFilters.filters[filterBy] = filters;

		if(filterBy === "price") {
			let priceValues = handlePrice(filters);
			newFilters.filters[filterBy] = priceValues;
		}
		loadFilterResult(myFilters.filters);

		setMyFilters(newFilters);
	};

	const handlePrice = value => {
		const data = prices;
		let array = [];

		for(let key in data) {
			if(data[key]._id === parseInt(value)) {
				array = data[key].array;
			}
		}
		return array;
	};
	const loadFilterResult = (newFilters) => {
		getFilteredProducts(skip, limit, newFilters).then(data => {
			if(data.error){
				setError(data.error);
			} else {
				setFilteredResults(data.data);
				setSize(data.size);
				setSkip(0);
			}
		});
	};
	const loadMoreResult = () => {
		let toSkip = skip + limit;
		getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
			if(data.error){
				setError(data.error);
			} else {
				setFilteredResults([...filteredResults, ...data.data]);
				setSize(data.size);
				setSkip(toSkip);
			}
		});
	};

	const loadMoreBtn = () => {
		return (
				size > 0 && size >= limit && (
						<button onClick={loadMoreResult} className="btn btn-warning mb-5">More Results</button>
					)
			);
	}
	return (
	<Layout title="Shop Page" description="Search and discover new books" className="container-fluid">
		
		<div className="row">
			<div className="col-4">
			<h4>Filter by category</h4>
				<ul>
					<Checkbox categories={categories} handleFilters={filters => handleFilters(filters, 'category')} />
				</ul>
				<h4>Filter by price</h4>
				<div>
					<RadioBox prices={prices} handleFilters={filters => handleFilters(filters, 'price')} />
				</div>
			</div>

			<div className="col-8">
				<h2 className="mb-4">Products</h2>
				<div className="row">
					{filteredResults.map((product, i) => (
						
					<div key={i} className="col-4 mb-3">
						<Card product={product} />
					</div>
						
						))}
				</div>
				<hr />
				{loadMoreBtn()}
			</div>	

		</div>


	</Layout>
	);
};
export default Shop;
