import $ from 'jquery';


const getProducts = () => {
    return $.get('http://localhost:3003/item')
}

const getProductById = (productId) => {
    return $.get(`http://localhost:3003/item/${productId}`)
}

const deleteProduct = (productId, onSuccessCb) => {
    $.ajax({
        url: `http://localhost:3003/item/${productId}`,
        method: 'DELETE',
        dataType: 'text',
        success: onSuccessCb 
    });
}

const addProduct = (product, onSuccessCb) => {
    console.log('product, ', product);
    $.ajax({
        url: `http://localhost:3003/item`,
        method: 'POST',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(product),
        success: onSuccessCb 
    });
}

const editProduct = (product, onSuccessCb) => {
    const id = product.id;
    $.ajax({
        url: `http://localhost:3003/item`,
        method: 'PUT',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(product),
        success: onSuccessCb 
    });
}

export default {
    getProducts,
    getProductById,
    deleteProduct,
    addProduct,
    editProduct
}