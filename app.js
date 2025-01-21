const API_URL = 'https://jsonplaceholder.typicode.com/users';

const userList = document.getElementById('user-list');
const addUserButton = document.getElementById('add-user-btn');
const userFormModal = document.getElementById('user-form-modal');
const userForm = document.getElementById('user-form');
const closeFormButton = document.getElementById('close-form-btn');


const fetchUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        displayUsers(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch users.');
    }
};

const displayUsers = (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        userItem.innerHTML = `
            <div>
                <strong>${user.name}</strong><br>
                ${user.email}<br>
                Department: ${user.company.name}
            </div>
            <div>
                <button class="edit-btn" onclick="openEditForm(${user.id})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;
        userList.appendChild(userItem);
    });
};


const openAddForm = () => {
    userForm.reset();
    document.getElementById('form-title').innerText = 'Add New User';
    userFormModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';  
};


const openEditForm = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`);
        const user = response.data;
        document.getElementById('form-title').innerText = 'Edit User';
        document.getElementById('first-name').value = user.name.split(' ')[0];
        document.getElementById('last-name').value = user.name.split(' ')[1];
        document.getElementById('email').value = user.email;
        document.getElementById('department').value = user.company.name;
        userFormModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';  

        userForm.onsubmit = (e) => {
            e.preventDefault();
            updateUser(userId);
        };
    } catch (error) {
        console.error('Error fetching user:', error);
        alert('Failed to load user details for editing.');
    }
};


const closeForm = () => {
    userFormModal.style.display = 'none';
    document.body.style.overflow = 'auto';  
    userForm.reset();
};


const addUser = async () => {
    const userData = {
        name: `${document.getElementById('first-name').value} ${document.getElementById('last-name').value}`,
        email: document.getElementById('email').value,
        company: {
            name: document.getElementById('department').value
        }
    };

    try {
        await axios.post(API_URL, userData);
        alert('User added successfully!');
        fetchUsers();
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Failed to add user.');
    } finally {
        closeForm();
    }
};


const updateUser = async (userId) => {
    const userData = {
        name: `${document.getElementById('first-name').value} ${document.getElementById('last-name').value}`,
        email: document.getElementById('email').value,
        company: {
            name: document.getElementById('department').value
        }
    };

    try {
        await axios.put(`${API_URL}/${userId}`, userData);
        alert('User updated successfully!');
        fetchUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user.');
    } finally {
        closeForm();
    }
};


const deleteUser = async (userId) => {
    try {
        await axios.delete(`${API_URL}/${userId}`);
        alert('User deleted successfully!');
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
    }
};


addUserButton.addEventListener('click', openAddForm);
closeFormButton.addEventListener('click', closeForm);

userForm.onsubmit = (e) => {
    e.preventDefault();
    addUser();
};


fetchUsers();
