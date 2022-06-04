import header from "./bestsellers-header";
import data from "./data";


export default class Table {
    subElements = {};
    wrapper = null;


    onClick = async (event) => {
        const deleteEl = event.target.closest("[data-element=handleDelete]");
        const editEl = event.target.closest("[data-element=handleEdit]");

        if (editEl) {
            this.editElement(event);

            const data = await this.checkFetch();
            const test = await data.json();
            console.log(test);


            const dataPost = await this.postFetch();
            const testPost = await dataPost.json()
            console.log(testPost);

            await this.deleteFetch();
            await this.putFetch();
            await this.checkFetch();
        }

        if (deleteEl) {
            this.removeElement(event);
        }

    }


    async deleteFetch() {
        const url = new URL('tickets', 'http://localhost:7070/');
        url.searchParams.set('id', 2);
        try {
            const responce = await fetch(url, {
                method: "DELETE",
            });
            // return responce;
        } catch(e) {
            console.log(e.message);
        }
    }

    async postFetch() {
        const url = new URL('tickets', 'http://localhost:7070/');
        const data = { name: 'EEEEELDEN RING', description: 'OOOHHH' }
        try {
            const responce = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }); 
            return responce;
        } catch (e) {
            console.log(e.message);
        }
    }

    async putFetch() {
        const url = new URL('tickets', 'http://localhost:7070/');
        url.searchParams.set('id', 3);
        const data = {name: 'TEST', description: 'test1111111' }
        try {
            const responce = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }); 
            return responce;
        } catch (e) {
            console.log(e.message);
        }
    }

    async checkFetch() {
        const url = new URL('tickets', 'http://localhost:7070/');
        // url.searchParams.set('id', 2);
        return await fetch(url);
    }

    removeElement(event) {
        const id = event.target.closest('.table__content-row').dataset.id;
        this.data = [...this.data].filter((item) => item.id !== id);
        event.target.closest('.table__content-row').remove();
    }

    onEdit = (event) => {
        event.preventDefault();
        const { productForm } = this.subElements;
        const allowedFields = Object.keys(this.defaultForm);
        const getValue = (field) => productForm.querySelector(`[name=${field}]`).value;

        const item = this.subElements[this.id];
        const productData = this.data.find((item) => item.id == this.id);

    
        for (const field of allowedFields) {
            const value = getValue(field);
            item.querySelector(`[data-element=${field}]`).textContent = field === 'price' ? parseInt(value) : value;
            productData[field] = value;
        }



        productForm.remove();
        this.wrapper = null;
        this.subElements.productForm = null;
        this.id = null;
    }


    onForm = (event) => {
        const addEl = event.target.closest("[data-element=handleAdd]");

        if (addEl) {

            if (this.wrapper !== null) {
                return;
            }
            this.createForm();
            
            const { productForm } = this.subElements;

            productForm.addEventListener('submit', this.onSave);

        }
    }

    onSave = (event) => {
        event.preventDefault();
        const allowedFields = Object.keys(this.defaultForm);
        const { productForm, body } = this.subElements;


        const getValue = (field) => productForm.querySelector(`[name=${field}]`).value;
        const data = {}

        for (const field of allowedFields) {
            if (field === 'title') {
                data.id = getValue(field);
            }
            data[field] = getValue(field);
        }
        
        const wrapper = document.createElement('div');
        wrapper.classList = 'table__content-body-row table__content-row';
        wrapper.dataset.element = `${data.id}`;
        wrapper.dataset.id = `${data.id}`
        wrapper.innerHTML = this.getTableRow(data);
        
        body.append(wrapper);


        productForm.remove();
        this.wrapper = null;
        this.subElements.productForm = null;
        this.id = null;
    }

    constructor() {
        this.headerConfig = header;
        this.render();
        this.defaultForm = {
            title: '',
            price: 0,
        }
        this.id = null;
    }

    async render() {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getTemplate();
        this.element = wrapper.firstElementChild;

        this.subElements = this.getSubElements();

        const data = await this.loadData()
        this.renderRows(data);

        this.initEventListeners();
    }


    async loadData() {
        const url = new URL('tickets', 'http://localhost:7070/');

        const responce = await fetch(url);
        const data = await responce.json();
        return data;
    }

    renderRows(data) {
        console.log(data)
        if (data.length) {
            this.addRows(data);
        }
    }

    addRows(data) {
        this.data = data;
        this.subElements.tableContent.innerHTML = this.getTableRows(data);
    }

    initEventListeners() {
        const { tableContent, tableHeader } = this.subElements;

        tableContent.addEventListener('click', this.onClick);
        tableHeader.addEventListener('click', this.onForm);
    }

    removeEventListeners() {
        document.removeEventListener('click', this.onClick);
        document.removeEventListener('click', this.onForm);
        document.removeEventListener('submit', this.onEdit);
    }

    createForm() {
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = this.getFormGroup();

        this.element.append(this.wrapper.firstElementChild);
        this.subElements.productForm = this.element.querySelector('[data-element=productForm');
    }


    setFormData(item) {
        const { productForm } = this.subElements;

        const allowedFields = Object.keys(this.defaultForm);


        for (const field of allowedFields) {
            const name = productForm.querySelector(`[name="${field}"]`);
            if (name !== null) {
                name.value = item[field] || this.defaultForm[field]
            }
        }

        productForm.addEventListener('submit', this.onEdit)
    }


    editElement(event) {
        if (this.wrapper !== null) {
            return;
        }

        this.id = event.target.closest('.table__content-row').dataset.id;
        const item = this.data.find((item) => item.id === this.id);

        this.createForm();
        this.setFormData(item);
    }

    getSubElements() {
        const elements = this.element.querySelectorAll('[data-element]')
        for (const item of elements) {
            this.subElements[item.dataset.element] = item;
        }
        return this.subElements;
    }



    getTableRows(data) {
        return data.map((item) => `
        <div class="table__content-body-row table__content-row" data-element="${item.id}" data-id="${item.id}">${this.getTableRow(item)}</div>
        `).join('');
    }


    getTableRow(item) {
        console.log(item);
        const cells = this.headerConfig.map(({ id, template }) => {
            return {
                id,
                template,
            }
        })

        return cells.map(({ id, template }) => {
            return template
                ? template()
                : ` <div class="table__content-cell" data-element="${id}">${item[id]}</div>`
        }).join('');
    }

    getFormGroup() {
        return `<form class="form-group" data-element="productForm">
        <label for="name" class="form-group__label">Название</label>
        <div class="form-group__input">
            <input class="form-group__control" name="title" type="text" id="name" required placeholder="Name product">
        </div>
        <label for="price" class="form-group__label">Стоимость</label>
        <div class="form-group__input">
            <input class="form-group__control" name="price" type="number" id="price" required placeholder="Price count">
        </div>
        <div class="form-group__buttons">
            <button  name="save" class="button button_primary">
                Save
             </button>
             <input  name="reset" class="button button_primary" type="reset" value="Reset">
        </div>
    </form>`
    }


    getTemplate() {
        return `
            <div class="container" data-element="tableEdit">
                <div class="table__header table__content-row" data-element="tableHeader">
                <button  class="button button_primary table__button ">
                Добавить тикет
             </button>
                </div>
                <div class="table__content" data-element="tableContent">
                 
                </div>
            </div>`
    }



    remove() {
        if (this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
        this.subElements = null;
    }


}