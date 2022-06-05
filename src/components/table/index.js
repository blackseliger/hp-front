import header from "./bestsellers-header";

const BACKEND_URL_L = 'http://localhost:7070/';
const BACKEND_URL_H = 'https://hp34.herokuapp.com/';
export default class Table {
    subElements = {};
    wrapper = null;

    onClick = async (event) => {
        const deleteEl = event.target.closest("[data-element=handleDelete]");
        const editEl = event.target.closest("[data-element=handleEdit]");
        const openEl = event.target.closest("[data-element=handleOpen]");

        if (editEl) {
            this.editElement(event);
        }

        if (deleteEl) {
            await this.removeElement(event);
        }

        if (openEl) {
            const description = openEl.closest('.table__content-row').lastElementChild;
            description.classList.toggle('table__detailed_hide');
        }

    }


    async deleteFetch(id) {
        const url = new URL('tickets', BACKEND_URL_H);
        url.searchParams.set('id', id);
        try {
            const responce = await fetch(url, {
                method: "DELETE",
            });
            return responce;
        } catch(e) {
            console.log(e.message);
        }
    }

    async putFetch(id, data) {
        const url = new URL('tickets', BACKEND_URL_H);
        url.searchParams.set('id', id);

        try {
            const responce = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }); 
            return await responce.json();
        } catch (e) {
            return await e.message;
        }
    }

    async fetchPost(data) {
        const url = new URL('tickets', BACKEND_URL_H);

        try {
            const responce = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            }); 
            return await responce.json();
        } catch (e) {
            return e.message;
        }
    }


    async removeElement(event) {
        const id = event.target.closest('.table__content-row').dataset.id;

        const responce = await this.deleteFetch(id);
        if (responce.ok) {
            this.data = [...this.data].filter((item) => item.id !== id);
            event.target.closest('.table__content-row').remove();
        }
    }

    onEdit = async (event) => {
        event.preventDefault();
        const { productForm, tableContent } = this.subElements;
        const allowedFields = Object.keys(this.defaultForm);
        const data = {};
        const getValue = (field) => productForm.querySelector(`[name=${field}]`).value;
        

         for (const field of allowedFields) {
            data[field] = getValue(field);
        }

        const responce = await this.putFetch(this.id, data)
        
        const row = tableContent.querySelector(`[data-element='${this.id}']`);
        const getValueRow = (field) => row.querySelector(`[data-row='${field}']`)
        const rowFields = ['name', 'description'];

        for (const field of rowFields) {
            getValueRow(field).textContent = responce[field];
        }


       this.deleteForm();
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
            productForm.addEventListener('click', this.hideForm);

        }
    }

    hideForm = (event) => {

        const handleDelete = event.target.closest('[data-element=hideForm]');
        if (handleDelete) {
            this.subElements.productForm.remove();
            this.wrapper = null;
        }
      
    }


     onSave = async (event) => {
        event.preventDefault();
        const allowedFields = Object.keys(this.defaultForm);
        const { productForm, tableContent } = this.subElements;

        const getValue = (field) => productForm.querySelector(`[name=${field}]`).value;
        const data = {}
        
        for (const field of allowedFields) {
            data[field] = getValue(field);
        }

        
        const responce = await this.fetchPost(data);

        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTableRows(responce);
        
        tableContent.append(wrapper);


        this.deleteForm();
    }


    constructor() {
        this.headerConfig = header;
        this.render();
        this.defaultForm = {
            name: '',
            description: 0,
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
        const url = new URL('tickets', BACKEND_URL_H);

        const responce = await fetch(url);
        const data = await responce.json();
        return data;
    }

    renderRows(data) {
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

    createForm(edit) {
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = this.getFormGroup(edit);

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

        productForm.addEventListener('click', this.hideForm);
        productForm.addEventListener('submit', this.onEdit)
    }


    editElement(event) {
        if (this.wrapper !== null) {
            return;
        }

        this.id = event.target.closest('.table__content-row').dataset.id;
        const item = this.data.find((item) => item.id === this.id);

        this.createForm('edit');
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
        if (!Array.isArray(data)) {
            const arr = [];
            arr.push(data)
            data = arr;
        }
        return data.map((item) => `
        <div class="table__content-body-row table__content-row" data-element="${item.id}" data-id="${item.id}">
        <div class="table__content-brief"> ${this.getTableRow(item)}</div>
        <div class="table__detailed table__detailed_hide"><p data-row='description'>${item.description}</p></div>
        </div>
        `).join('');
    }


    getTableRow(item) {

        const cells = this.headerConfig.map(({ id, template }) => {
            return {
                id,
                template,
            }
        })

        return cells.map(({ id, template }) => {
            return template
                ? template(item[id])
                : ` <div class="table__content-cell" data-element="${id}">${item[id]}</div>`
        }).join('');
    }

    getFormGroup(edit) {
        return `<form class="form-group" data-element="productForm">
        <div class="form-group_icon">
                <img src="./assets/icons/handleDelete.svg" data-element="hideForm" alt="">
            </div>
        <div class="from-group__title">${edit ? 'Изменить тикет' : 'Добавить тикет'}</div>
        <label for="name" class="form-group__label">Название</label>
        <div class="form-group__input">
            <input class="form-group__control" name="name" type="text" id="name" required placeholder="Название задачи">
        </div>
        <label for="price" class="form-group__label">Описание</label>
        <div class="form-group__input">
            <input class="form-group__control" name="description" type="text" id="description" required placeholder="Подробное описание">
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
                <div class="table__header" data-element="tableHeader">
                <button  class="button button_primary table__button" data-element="handleAdd">
                Добавить тикет
             </button>
                </div>
                <div class="table__content" data-element="tableContent">
                 
                </div>
            </div>`
    }


    deleteForm() {
        const { productForm } = this.subElements;
        productForm.remove();
        document.removeEventListener('click', this.hideForm);
        document.removeEventListener('submit', this.onSave);
        this.wrapper = null;
        this.subElements.productForm = null;
        this.id = null;
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