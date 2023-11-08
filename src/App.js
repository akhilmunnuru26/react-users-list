import React, { useState, useEffect } from "react";
import { GrUpdate } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import "./App.css";

const date = new Date();

const hours = date.getHours();
const minutes = date.getMinutes();
const time = `${hours}:${minutes}`;
const year = date.getFullYear();
const month = `0${date.getMonth() + 1}`.slice(-2);
const day = `0${date.getDate()}`.slice(-2);
const formattedDate = `${year}-${month}-${day}`;

const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  visitType: "Dental",
  provider: "Dr.Cris Patt",
  appDate: formattedDate,
  appTime: time,
};

const App = () => {
  const [userInfo, setUserInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    visitType: "Dental",
    provider: "Dr.Cris Patt",
    appDate: formattedDate,
    appTime: time,
  });

  const [buttonStatus, setButtonStatus] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [isUserExist, setIsUserExist] = useState(false);

  useEffect(() => {
    getData();
    validateUserInfo();
  }, [userInfo]);

  const getData = async () => {
    await axios
      .get("https://6543758001b5e279de206892.mockapi.io/api/v1/UserData")
      .then((response) => setUsersData(response.data));
  };

  const onUpdate = async (id) => {
    setUpdate(!update);
    const response = await axios.get(
      `https://6543758001b5e279de206892.mockapi.io/api/v1/UserData/${id}`
    );
    setUserInfo({ ...response.data });
  };

  const deleteUser = async (id) => {
    await axios
      .delete(
        `https://6543758001b5e279de206892.mockapi.io/api/v1/UserData/${id}`
      )
      .then(() => getData());
  };

  const validateUserInfo = () => {
    const { firstName, lastName, email, phoneNumber } = userInfo;

    const isValidNumber =
      Number.isInteger(parseInt(phoneNumber)) && phoneNumber.length === 10;
    const isValidEmail = email.endsWith("@gmail.com");

    if (
      firstName !== "" &&
      lastName !== "" &&
      phoneNumber !== "" &&
      email !== "" &&
      isValidNumber &&
      isValidEmail
    ) {
      setButtonStatus(false);
    } else {
      setButtonStatus(true);
    }
  };

  const renderTable = () => (
    <div className="table-responsive table-responsive-sm table-responsive-md table-responsive-lg">
      <table className="table  table-borderless">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Visit Type</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((data) => {
            const {
              id,
              firstName,
              lastName,
              phoneNumber,
              email,
              visitType,
              provider,
              appDate,
              appTime,
            } = data;
            return (
              <tr key={id}>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{phoneNumber}</td>
                <td>{email}</td>
                <td>{visitType}</td>
                <td>{provider}</td>
                <td>{appDate}</td>
                <td>{appTime}</td>
                <td>
                  <button
                    className="update-btn"
                    type="button"
                    onClick={() => onUpdate(id)}
                  >
                    <GrUpdate />
                  </button>
                </td>
                <td>
                  <button
                    className="update-btn"
                    type="button"
                    onClick={() => deleteUser(id)}
                  >
                    <AiFillDelete />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  let isExist = false;

  const updateUserData = async () => {
    const {
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      visitType,
      provider,
      appDate,
      appTime,
    } = userInfo;
    const filteredData = usersData.filter(
      (user) => user.id!==id
    );
    
    
    filteredData.forEach((user) => {
      if (
        user.firstName === firstName &&
        user.lastName === lastName &&
        phoneNumber === user.phoneNumber &&
        user.email === email
      ) {
        isExist = true
        return;
      }
      return;
    });

    if (isExist) {
      setIsUserExist(true)
      return;
    }
    setIsUserExist(false)
    await axios({
      method: "put",
      url: `https://6543758001b5e279de206892.mockapi.io/api/v1/UserData/${id}`,
      data: {
        firstName,
        lastName,
        phoneNumber,
        email,
        visitType,
        provider,
        appDate,
        appTime,
      },
    })
      .then(() => getData())
      .then(() => setUpdate(false));
    setUserInfo(initialState);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    setUserInfo({ ...userInfo, [name]: e.target.value });
  };

  const renderFormSections = () => {
    return (
      <div className="row">
        <div className="d-flex flex-sm-column flex-md-row">
          <div className="col ml-5 input-container form-floating p-0 pt-1 mb-3 mt-3">
            <input
              autoComplete="off"
              type="text"
              onChange={(e) => handleChange(e)}
              value={userInfo?.firstName}
              name="firstName"
              placeholder="Enter First Name"
              className="form-control input-element"
              id="First Name"
            />
            <label htmlFor="First Name">First Name</label>
          </div>
          <div className="col input-container form-floating p-0 pt-1 mb-3 mt-3">
            <input
              autoComplete="off"
              onChange={(e) => handleChange(e)}
              value={userInfo?.lastName}
              className="form-control input-element"
              id="Last Name"
              placeholder="Enter last Name"
              name="lastName"
            />
            <label htmlFor="Last Name">Last Name</label>
          </div>
        </div>
        <div className="d-flex flex-sm-column flex-md-row">
          <div
            
            className="col input-container form-floating p-0 pt-1 mb-3 mt-3"
          >
            <input
              autoComplete="off"
              onChange={(e) => handleChange(e)}
              name="email"
              value={userInfo?.email}
              className="form-control input-element"
              id="email"
              placeholder="Enter Email Id"
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="col input-container form-floating p-0 pt-1 mb-3 mt-3">
            <input
              autoComplete="off"
              name="phoneNumber"
              onChange={(e) => handleChange(e)}
              value={userInfo?.phoneNumber}
              className="form-control input-element"
              id="phoneNumber"
              placeholder="Enter phone number"
            />
            <label htmlFor="phoneNumber">Phone Number</label>
          </div>
        </div>
        <div className="d-flex flex-sm-column flex-md-row">
          <div className="col input-container">
            <label className="labels" htmlFor="visitType">
              Visit Type
            </label>
            <select
              onChange={(e) => handleChange(e)}
              name="visitType"
              className="select-element"
              value={userInfo?.visitType}
              id="visitType"
            >
              <option value="Dental">Dental</option>
              <option value="General">General</option>
              <option value="Gastroentrolgy">Gastroentrolgy</option>
              <option value="Cardiolgy">Cardiolgy</option>
              <option value="Skin Care">Skin Care</option>
            </select>
          </div>
          <div className="col input-container">
            <label className="labels" htmlFor="provider">
              Provider
            </label>
            <select
              onChange={(e) => handleChange(e)}
              name="provider"
              className="select-element"
              value={userInfo?.provider}
              id="provider"
            >
              <option value="Dr.Cris Patt">Dr.Cris Patt</option>
              <option value="Dr.Robert Downey">Dr.Robert Downey</option>
              <option value="Dr.Andrew Grafield">Dr.Andrew Grafield</option>
              <option value="Dr.Steven">Dr.Steven</option>
              <option value="Dr.Peter Parker">Dr.Peter Parker</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-sm-column flex-md-row">
          <div className="col input-container">
            <label className="labels" htmlFor="start">
              Select a date
            </label>
            <input
              onChange={(e) => handleChange(e)}
              name="appDate"
              className="input-element form-control"
              type="date"
              id="start"
              value={userInfo?.appDate}
              min="2009-01-01"
              max="2028-12-31"
            />
          </div>
          <div className="col input-container">
            <label className="labels" htmlFor="time">
              Select a time
            </label>
            <input
              name="appTime"
              onChange={(e) => handleChange(e)}
              value={userInfo?.appTime}
              type="time"
              min="09:00"
              max="18:00"
              required
              className="input-element form-control"
              id="time"
              placeholder="Select a Time"
            />
          </div>
        </div>
      </div>
    );
  };

  const onSubmitForm = async () => {
    validateUserInfo();

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      visitType,
      provider,
      appDate,
      appTime,
    } = userInfo;
    usersData.forEach((user) => {
      if (
        user.firstName === firstName ||
        user.email === email ||
        phoneNumber === user.phoneNumber
      ) {
        setIsUserExist(true);
        isExist = true;
        return;
      } else {
        setIsUserExist(false);
        isExist = false;
        return;
      }
    });

    if (isExist) {
      return;
    } else {
      await axios
        .post("https://6543758001b5e279de206892.mockapi.io/api/v1/UserData", {
          firstName,
          lastName,
          email,
          phoneNumber,
          visitType,
          provider,
          appDate,
          appTime,
        })
        .then(() => getData());
    }

    setUserInfo(initialState);
  };

  const renderForm = () => (
    <form className="container input-form">
      {renderFormSections()}
      <button className="submit-btn" type="button">
        {update ? (
          <span onClick={() => updateUserData()}>Update</span>
        ) : (
          <span onClick={() => onSubmitForm()}>Submit</span>
        )}
      </button>
    </form>
  );

  return (
    <div className="container">
      {renderForm()}
      {isUserExist && (
        <div className="alert alert-danger">
          <strong>Danger!</strong> User Already Exist.
        </div>
      )}
      {renderTable()}
    </div>
  );
};

export default App;
