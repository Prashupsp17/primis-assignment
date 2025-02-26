import { useState, useEffect, useRef } from 'react'

import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import data from '../assets/data.json';


const Assignment = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: ''
  })

  const [userList, setUserList] = useState(data);
  const [isUpdate, setIsUpdate] = useState(false);

  const modalRef = useRef();

  const handleOpenModal = () => {
    setIsUpdate(false);
    setIsOpen(true);

  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.firstName.trim() === "") {
      alert("Please Enter the FirstName");
    } else if (user.lastName.trim() === "") {
      alert("Please Enter the lastName");
    } else if (user.email.trim() === "") {
      alert("Please Enter the email ");
    } else {
      const obj = {
        id: Date.now(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email

      }

      setUserList([...userList, obj]);
      setIsOpen(false);
    }

    toast.success("User Added Successfully");


  }

  const handleEditUser = (row) => {
    setIsUpdate(true);
    setIsOpen(true);
    setUser({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email
    });

  }

  const handleUpdateUser = (e) => {
    e.preventDefault();
    const updatedData = userList.map((person, i) => {

      if (person.id === user.id) {
        return {
          ...person,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }

      }
      return person;
    })
    setUserList(updatedData);
    toast.success("User Updated Successfully");
    setIsOpen(false);
    setUser({
      id: '',
      firstName: '',
      lastName: '',
      email: ''
    });
  }



  const columns = [
    {
      name: 'Id',
      selector: row => row.id,
    },
    {
      name: 'First_Name',
      selector: row => row.firstName,
    },
    {
      name: 'Last_Name',
      selector: row => row.lastName,
    },
    {
      name: 'Email',
      selector: row => row.email,
    },
    {
      name: 'Update',
      selector: row => <Button variant="contained"
        sx={{
          backgroundColor: 'yellow',
          color: 'black',
        }} onClick={() => handleEditUser(row)}>Update</Button>,
    },
  ];


  useEffect(() => {

    const handleCloseModal = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsUpdate(false);
        setUser({
          id: '',
          firstName: '',
          lastName: '',
          email: ''
        });
      }
    }


    document.addEventListener("mousedown", handleCloseModal);

    return () => {
      document.removeEventListener("mousedown", handleCloseModal);
    }

  }, [])


  return (
    <>
      <div className="container">



        <DataTableExtensions
          columns={columns}
          data={userList}
          export={false}
          filter={false}

        >
          <DataTable
            noHeader
            defaultSortField="id"
            defaultSortAsc={false}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            scrollable
            highlightOnHover
            subHeader
            subHeaderComponent={
              <Button variant="contained" size="small" onClick={handleOpenModal}>
                Add New User
              </Button>
            }

          />
        </DataTableExtensions>
        <div
          className="modal"
          ref={modalRef}
          style={{ display: isOpen ? "block" : "none" }}>
          <div className="form-wrapper">
            <h3>Add New User Details</h3>
            <form className="form-details" onSubmit={isUpdate ? handleUpdateUser : handleSubmit}>
              <input type="text" name="firstName" value={user.firstName} onChange={(e) => handleOnChange(e)} placeholder="Enter First Name" required />
              <input type="text" name="lastName" value={user.lastName} onChange={(e) => handleOnChange(e)} placeholder="Enter Last Name" required />
              <input type="email" name="email" value={user.email} onChange={(e) => handleOnChange(e)} placeholder="Enter Email" required />
              <Button variant="contained" type="submit">{isUpdate ? 'Update' : 'Submit'}</Button>
            </form>
          </div>

        </div>
      </div>
      <ToastContainer autoClose={2000} />
    </>
  )
}

export default Assignment
