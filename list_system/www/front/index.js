let default_page = '/list/entries';
const pages = {
  entries: '/list/entries',
  lifters: '/list/lifters',
  attempts: '/list/attempts',
  division: '/list/division',
  weight: '/list/weight',
}
const shows = document.getElementById('shows')
shows.addEventListener('click', (e) => {
  const page = pages[e.target.id]
  if (page) {
    default_page = page
    loadPage()
  }
})

//fo: LoadPage with info
async function loadPage() {
  const root = document.getElementById('root');
  const table = document.createElement('table');
  let data = {};
  root.innerHTML = ''

  try {
    const response = await fetch(default_page);
    data = await response.json();
  }
  catch (e) {
    throw e;
  }

  for (const i in data) {
    const tr = document.createElement('tr');

    for (const heads in data[i]) {
      const th = document.createElement('th');
      th.textContent = heads;
      tr.appendChild(th);
    }
    table.appendChild(tr);
    break;
  }

  data.forEach( user => {
    const tr = document.createElement('tr');

    for(const key in user) {
      const tdValue = document.createElement('td');
      tdValue.textContent = user[key];
      tr.id = user.id;
      tr.appendChild(tdValue);
    }
    table.appendChild(tr);
  });
  root.append(table);
}
loadPage();

//fo: Div with Forms
function showForm(idToShow) {
  const forms = document.querySelectorAll('#forms form');
  forms.forEach(form => {
    if(form.id === idToShow) {
      form.hidden = !form.hidden;
    } else {
      form.hidden = true;
    }
  });
}

//fo: List
//k: List for Selects
const division = document.getElementsByName('division_name')
division.forEach(async (select_division) => {
  const list_division = await fetch('/list/division')
  const res_division = await list_division.json()

  for(let i in res_division) {
    const option = document.createElement('option')
    option.value = res_division[i].id
    option.textContent = res_division[i].name
    select_division.appendChild(option)
  }
})
const weight_class = document.getElementsByName('weight_class_name')
weight_class.forEach(async (select_weight) => {
  const list_weight = await fetch('/list/weight')
  const res_weight = await list_weight.json()

  for(let i in res_weight) {
    const option = document.createElement('option')
    option.value = res_weight[i].id
    option.textContent = res_weight[i].name
    select_weight.appendChild(option)
  }
})
const record = document.getElementsByName('record')
record.forEach( (select_record) => {
  const data = ['Not Disqualified','Disqualified']
  for(let i in data) {
    const option = document.createElement('option')
    option.value = data[i]
    option.textContent = data[i]
    select_record.appendChild(option)
  }
})
const lift_type = document.getElementsByName('lift_type')
lift_type.forEach( (select_type) => {
  const list = ['SQ','BP','DL']
  for(let i in list) {
    const option = document.createElement('option')
    option.value = list[i]
    option.textContent = list[i]
    select_type.appendChild(option)
  }
})
const attempt_num = document.getElementsByName('attempt_number')
attempt_num.forEach( (select_num) => {
  const list = [1,2,3]
  for(let i in list) {
    const option = document.createElement('option')
    option.value = list[i]
    option.textContent = list[i]
    select_num.appendChild(option)
  }
})



//fo: Lifters
//k: Form for Adding Lifters
/** @type {HTMLFormElement} */
const addLifter = document.getElementById('addLifter');
addLifter.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addLifter);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/add/lifter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_add_lifter = document.getElementById('btn_add_lifter');
btn_add_lifter.addEventListener('click', () => {
  showForm('addLifter');
});
//k: Form for Updating Lifters
/** @type {HTMLFormElement} */
const updateLifter = document.getElementById('updateLifter');
updateLifter.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(updateLifter);
  const data = Object.fromEntries(formData.entries());
  const response = await fetch('/update/lifter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_upd_lifter = document.getElementById('btn_upd_lifter');
btn_upd_lifter.addEventListener('click', () => {
  showForm('updateLifter')
});
//k: Form for Deleting Lifters
/** @type {HTMLFormElement} */
const deleteLifter = document.getElementById('deleteLifter');
deleteLifter.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(deleteLifter);
  const data = Object.fromEntries(formData.entries());
  const response = await fetch('/delete/lifter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_del_lifter = document.getElementById('btn_del_lifter');
btn_del_lifter.addEventListener('click', () => {
  showForm('deleteLifter')
});



//fo: Entries
//k: Form for Adding Entries
/** @type {HTMLFormElement} */
const addEntry = document.getElementById('addEntry');
addEntry.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addEntry);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/add/entry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_add_entry = document.getElementById('btn_add_entry');
btn_add_entry.addEventListener('click', async() => {
  showForm('addEntry');
});
//k: Form for Updating Entries
/** @type {HTMLFormElement} */
const updateEntry = document.getElementById('updateEntry');
updateEntry.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(updateEntry);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/update/entry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_update_entry = document.getElementById('btn_upd_entry');
btn_update_entry.addEventListener('click', async() => {
  showForm('updateEntry');
});
//k: Form for Deleting Entries
/** @type {HTMLFormElement} */
const deleteEntry = document.getElementById('deleteEntry');
deleteEntry.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(deleteEntry);
  const data = Object.fromEntries(formData.entries());
  const response = await fetch('/delete/entry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_del_entry = document.getElementById('btn_del_entry');
btn_del_entry.addEventListener('click', () => {
  showForm('deleteEntry')
});



//fo: Attempts
//k: Form for Adding Attempt
/** @type {HTMLFormElement} */
const addAttempt = document.getElementById('addAttempt');
addAttempt.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addAttempt);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/add/attempt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_add_attempt = document.getElementById('btn_add_attempt');
btn_add_attempt.addEventListener('click', () => {
  showForm('addAttempt')
});

//k: Form for Updating Attempt
/** @type {HTMLFormElement} */
const updateAttempt = document.getElementById('updateAttempt');
updateAttempt.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(updateAttempt);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/update/attempt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_upd_attempt = document.getElementById('btn_upd_attempt');
btn_upd_attempt.addEventListener('click', () => {
  showForm('updateAttempt')
});

//k: Form for Deleting Attempt
/** @type {HTMLFormElement} */
const deleteAttempt = document.getElementById('deleteAttempt');
deleteAttempt.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(deleteAttempt);
  const data = Object.fromEntries(formData.entries());
  const response = await fetch('/delete/attempt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_del_attempt = document.getElementById('btn_del_attempt');
btn_del_attempt.addEventListener('click', () => {
  showForm('deleteAttempt')
});
//k: Form for Displaying Attempts
/** @type {HTMLFormElement} */
const displayAttempt = document.getElementById('displayAttempt');
displayAttempt.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(displayAttempt);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/send/display', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (!result.ok) {
    console.error("Not OK!")
    return
  }
  loadPage();
});
const btn_display_attempt = document.getElementById('btn_display_attempt');
btn_display_attempt.addEventListener('click', async() => {
  showForm('displayAttempt');
});
