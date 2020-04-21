import React, {useState} from 'react';
import Layout from '../core/Layout';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import {createCategory} from './apiAdmin';

const AddCategory = () => {
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const {user, token} = isAuthenticated();

	const handleChange = (e) => {
		setError('');
		setName(e.target.value);

	};

	const clickSubmit = (e) => {
		e.preventDefault();
		setError('');
		setSuccess(false);

		createCategory(user._id, token, {name})
		.then(data => {
			if(data.error) {
				setError(data.error);
			} else {
				setError('');
				setSuccess(true);
			}
		});
	};

	const newCategoryForm = () => (
		<form onSubmit={clickSubmit}>
			<div className="form-group">
				<label className="text-muted">Name</label>
				<input type="text" className="form-control" onChange={handleChange} value={name} autoFocus />
				
			</div>
			<button className="btn btn-outline-primary">Create New Category </button>
		</form>
		);

		const showSuccess = () => {
			if(success) {
				return <h3 className="text-success">{name} category created</h3>
			}
		};

		const showError = () => {
			if(error) {
				return <h3 className="text-danger">category already exists!</h3>
			}
		};

		return (
		<Layout title="create a new category" description={`Welcome ${user.name}, Select a name for a new Category`}>
			<div className="row">
				
				<div className="col-md-8 offset-md-2">
					{showSuccess()}
					{showError()}
					{newCategoryForm()}
					
					
				</div>
				
			</div>
		</Layout>	
		)
};

export default AddCategory;