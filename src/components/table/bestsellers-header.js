const header = [
  {
    id: 'name',
    title: 'Name',
   
  },
  {
    id: 'created',
    title: 'Price',
   
  },
  {
    id: 'action',
    title: 'Action',
    template: () => { return `<div class="table__content-cell table__content-cell-icons">
    <div class="table__icon">
        <img src="./assets/icons/handleEdit.svg" class="table__icon-img" data-element="handleEdit" alt="edit">
    </div>
    <div class="table__icon">
        <img src="./assets/icons/handleDelete.svg" class="table__icon-img" data-element="handleDelete" alt="delete">
    </div>
</div>`;
    }
  },
];

export default header;
