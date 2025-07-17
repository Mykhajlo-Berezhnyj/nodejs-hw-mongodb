import { contactFields } from '../../db/models/contactFields.js';
import { isChecked } from '../../utils/isChecked.js';
import { renderPaginationControls } from '../renderPaginationControls.js';

export const renderContactsList = (
  contacts,
  msg,
  {
    page,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    perPage,
    query,
  },
) => `<html>
    <head>
    <link
     rel="stylesheet"
     href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      />
    <title>Contacts</title>
     <style>
      .table-hover  {
      --bs-table-hover-bg: rgb(6, 35, 61);
      --bs-table-hover-color: white !important;
    }
      td.empty {
        background-color: #ffcccc; /* light red */
      }
      tr {
        cursor: pointer;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </head>
    <body style="display: flex; flex-direction: column; justify-content: center; text-align: center;">
    <a href="/" style="align-self: flex-start; margin-left: 20px;">Back</a>
    <h1>Contacts</h1>
   <div style="display: flex; align-items: center; gap: 12px; margin: 20px 0;">
  <p style="margin: 0;">Total contacts: ${contacts.length}</p>
  <a href="/contacts/new" class="btn btn-success btn-sm">
    ➕ Add new
  </a>
</div>
</div>
        <table class="table table-hover table-bordered table-striped">
         <thead class="table-adark">
         <tr>
         <form method="GET" action="/contacts">
         <th>Filter</th>
         <th>
         <input type="text" name="name" aria-label= "filter the name" title="filter the name" value="${
           query.name || ''
         }" class="form-control form-control-sm"/>
         </th>
         <th>
         <input type="text" name="phoneNumber" aria-label= "filter the phone Number" title="filter the phone Number" value="${
           query.phoneNumber || ''
         }" class="form-control form-control-sm"/>
         </th>
          <th>
         <input type="text" name="email" aria-label= "filter the email" title="filter the email" value="${
           query.email || ''
         }" class="form-control form-control-sm"/>
         </th>
         <th>
         <select name="isFavourite" class="form-select form-select-sm" style="margin-bottom: 6px;">
         <option value="">All</option>
         <option value="true" ${
           query.isFavourite === 'true' ? 'selected' : ''
         }>True</option>
         <option value"false" ${
           query.isFavourite === 'false' ? 'selected' : ''
         }>False</option>
         </select>
         </th>
         <th>
         <div style="display: flex; flex-direction: column;">
         <label>
         <input type="checkbox" name="contactType" value="work" ${
           isChecked(query.contactType, 'work') ? 'checked' : ''
         }/>
         Work
         </label>
         <label>
         <input type="checkbox" name="contactType" value="home" ${
           isChecked(query.contactType, 'home') ? 'checked' : ''
         }/>
         Home
         </label>
         <label>
         <input type="checkbox" name="contactType" value="personal" ${
           isChecked(query.contactType, 'personal') ? 'checked' : ''
         } />
         Personal
         </label>
         </div>
         </th>
         <th>
         <input type="date" name="createdAt" aria-label="filter the createdAt" title="filter the createdAt" value="${
           query.createdAt || ''
         }" class="form-control form-control-sm"/>
         </th>
         <th>
         <input type="date" name="updateAt" aria-label="filter the updateAt" title="filter the updateAt" value="${
           query.updateAt || ''
         }" class="form-control form-control-sm"/>
         </th>
         <th>
         <input type="text" name="id" aria-label="id" title="filter the id" value="${
           query.id || ''
         }"  class="form-control form-control-sm"/>
         </th>
         <th>
         <button type="submit" class="btn btn-sm btn-info">🔁 Apply filters</button>
         <button type="submit" class="btn btn-sm btn-info">🔁 Reset filters</button>
         </th>
         </form>
         </tr>
        <tr>
        <th>№</th>
        ${contactFields
          .map(
            (field) => `<th>${field.label}
        <div>
        <form method="GET" action="/contacts">
        <input type="hidden" name="sortBy" value="${field.key}"/>
        <button type="submit" name="sortContacts" value="${
          query.sortContacts === 'asc' ? 'decs' : 'asc'
        }" class="btn btn-sm btn-outline-secondary">
            ${query.sortContacts === 'asc' ? '⬆️' : '⬇️'}
        </button>
        </form>
        </div>
        </th>`,
          )
          .join('')}
        <th>ID</th>
        <th>Option</th>
        </tr>
        </thead>
        <tbody>
      ${contacts
        .map(
          (contact, index) => `
        <tr onclick="location.href='/contacts/${contact._id}'">
        <td>${index + 1}</td>
        ${contactFields
          .map((field) => {
            const cell = field.format(contact[field.key]);
            const emptyClass = cell === 'N/A' ? 'empty' : '';
            return `<td class='${emptyClass}'>${cell}</td>`;
          })
          .join('')}
          <td>
          <span title="Click to copy ${
            contact._id
          }" onclick ="event.stopPropagation(); navigator.clipboard.writeText('${
            contact._id
          }')">
          ${contact._id.toString().slice(0, 6)}...</span></td>
          <td>
          <a href="/contacts/${
            contact._id
          }/edit" class="btn btn-sm btn-warning" onclick="event.stopPropagation()" title="Edit" aria-label="Edit">✏️Edit</a>
         <form method="POST" action="/contacts/${
           contact._id
         }?_method=DELETE" style="display:inline;" onclick="event.stopPropagation()">
            <button type="submit" class="btn btn-sm btn-danger" title="Delete" aria-label="Delete">🗑️Delete</button>
          </form>
        </td>
        </tr>`,
        )
        .join('')}
        </tbody>
        </table>
<div style="display: flex; justify-content: space-between;">
  <form method="GET" action="/contacts" style="display: flex; gap: 12px; justify-content: center; align-items: center;">
  <label style="display: flex; flex-direction: column; align-items: center;">
  Number per page
  <input type= "number" name="perPage" min="1" value="${
    query.perPage || 10
  }" class="form-control form-control-sm"
        style="width: 80px;"/>
  </label>
  <button type="submit" class="btn btn-sm btn-info" style="align-self: end">🔁 Apply</button>
  </form>
   ${renderPaginationControls({ page, totalPages, query })}
  <form method="GET" action="/contacts" style="display: flex; gap: 12px; justify-content: center; align-items: center;">
  <label style="display: flex; flex-direction: column; align-items: center;">
   Go to page
  <input type= "number" name="page" min="1" value="${
    query.page || 1
  }" class="form-control form-control-sm"
        style="width: 80px;"/>
        </label>
        <button type="submit"class="btn btn-sm btn-info"  style="align-self: end">🔁 Go</button>
  </form>
</div>

${
  msg
    ? `
  <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
    <div id="liveToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${msg}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
`
    : ''
}

        </body>
          <script>
  const params = new URLSearchParams(window.location.search);
  if (params.has('msg')) {
    const toastEl = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
    const url = new URL(window.location);
    url.searchParams.delete('msg');
    window.history.replaceState({}, '', url);
  }
</script>
    </html>`;
