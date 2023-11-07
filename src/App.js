import React,{useState,useEffect} from 'react'
import { GrUpdate } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import axios from 'axios'
import './App.css'

const date = new Date();
   
const hours = (date.getHours())
const minutes = (date.getMinutes())
const time = `${hours}:${minutes}`
const year = date.getFullYear();
const month = `0${date.getMonth() + 1}`.slice(-2);
const day = `0${date.getDate()}`.slice(-2);
const formattedDate = `${year}-${month}-${day}`;




const App = () => {

   
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [id,setUserId] = useState('')
    const [email,setEmail] = useState('')
    const [phoneNumber,setPhoneNumber] = useState('')
    const [visitType,setVisitType] = useState('Dental')
    const [provider,setProvider] = useState('Dr.Cris Patt')
    const [appDate,setAppDate] = useState(formattedDate)
    const [appTime,setAppTime] = useState(time)
    const [buttonStatus,setButtonStatus] = useState(true)
    const [usersData,setUsersData] = useState([])
    const [update,setUpdate] = useState(false)

    useEffect(()=>{
        getData()
        validateUserInfo()
        
     },[firstName,lastName,phoneNumber,email,visitType,provider])

    const getData = async () => {
        await axios.get("https://6543758001b5e279de206892.mockapi.io/api/v1/UserData").then((response) => setUsersData(response.data))
    }

    const setUpdatedData = () => {
        setUserId(localStorage.getItem('ID'))
        setFirstName(localStorage.getItem("FirstName"))
        setLastName(localStorage.getItem("LastName"))
        setPhoneNumber(localStorage.getItem("PhoneNumber"))
        setEmail(localStorage.getItem("EmailId"))
        setVisitType(localStorage.getItem("Visit_Type"))
        setProvider(localStorage.getItem("Provider"))
        setAppDate(localStorage.getItem("App_Date"))
        setAppTime(localStorage.getItem("App_Time"))
    }

    const onUpdate = (data) => {
        setUpdate(!update)
         let {id,firstName,lastName,phoneNumber,email,visitType,provider,appDate,appTime} = data
         localStorage.setItem('ID',id)
         localStorage.setItem('FirstName',firstName)
         localStorage.setItem('LastName',lastName)
         localStorage.setItem('EmailId',email)
         localStorage.setItem('PhoneNumber',phoneNumber)
         localStorage.setItem('Visit_Type',visitType)
         localStorage.setItem('Provider',provider)
         localStorage.setItem('App_Date',appDate)
         localStorage.setItem('App_Time',appTime)
         setUpdatedData()
     } 

    const deleteUser = async (id) => {
        await axios.delete(`https://6543758001b5e279de206892.mockapi.io/api/v1/UserData/${id}`).then(() => getData())

    }

    let isExist = false
    
    

    const validateUserInfo = () => {
             
            const isValidNumber = Number.isInteger(parseInt(phoneNumber)) && phoneNumber.length === 10
            const isValidEmail = email.endsWith("@gmail.com")
            
            
            if (firstName!=='' && lastName!=='' && phoneNumber!=='' && email!=='' && isValidNumber && isValidEmail  ){
                setButtonStatus(false)
            }else{
                setButtonStatus(true)   
            }
    }

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
    { usersData.map((data) => {
                     const {id,firstName,lastName,phoneNumber,email,visitType,provider,appDate,appTime} = data
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
                       <td><button className="update-btn" type="button" onClick={() => onUpdate(data)}><GrUpdate/></button></td>
                       <td><button className="update-btn" type="button" onClick={() => deleteUser(id)}><AiFillDelete/></button></td>
                     </tr>
                 )
            }) }  
    </tbody>
  </table>
  </div>
)

    const updateUserData = async (event) => {
        event.preventDefault()
        usersData.pop()
         usersData.forEach((user) => {
             if( user.firstName === firstName && user.lastName === lastName && phoneNumber === user.phoneNumber && user.email === email){
                      isExist = true
                 }
                  return
         })
     
         if (isExist){
             alert("User Already Exist!!")
             return
         }
        
        await axios({ method: 'put',
        url: `https://6543758001b5e279de206892.mockapi.io/api/v1/UserData/${id}`,
        data: {
            firstName,
            lastName,
            phoneNumber,
            email,
            visitType,
            provider,
            appDate,
            appTime
        }}).then(() => getData()).then(() => setUpdate(false))
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setEmail('')
        setVisitType('')
        setProvider('')
        setAppDate('')
        setAppTime('')
    }
    

    const renderFormSections = () => {return (
        <div className="row">
            <div className="d-flex flex-sm-column flex-md-row">
                <div className="col ml-5 input-container form-floating p-0 pt-1 mb-3 mt-3">
                    <input type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName} name="firstName" placeholder='Enter First Name' className="form-control input-element" id="First Name"  />
                    <label   htmlFor="First Name" >First Name</label>
                </div>
                <div className="col input-container form-floating p-0 pt-1 mb-3 mt-3">
                    <input onChange={(e) => setLastName(e.target.value)}  value={lastName} className="form-control input-element" id="Last Name" placeholder='Enter last Name' name="lastName"/>
                    <label  htmlFor="Last Name">Last Name</label>
                </div>
            </div>
            <div  className="d-flex flex-sm-column flex-md-row">
                <div className="col input-container form-floating p-0 pt-1 mb-3 mt-3" > 
                    <input onChange={(e) => setEmail(e.target.value)} value={email} className="form-control input-element" id="email" placeholder='Enter Email Id' />
                    <label htmlFor="email" >Email</label>
                </div>
                <div className="col input-container form-floating p-0 pt-1 mb-3 mt-3">
                    <input onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} className='form-control input-element' id="phoneNumber" placeholder='Enter phone number' />
                    <label  htmlFor="phoneNumber">Phone Number</label>
                </div>
            </div>
            <div  className="d-flex flex-sm-column flex-md-row">
                <div className="col input-container" >
                <label className="labels" htmlFor="visitType">Visit Type</label>
                <select onChange={(e) => setVisitType(e.target.value)} name="visitType" className='select-element'  value={visitType} id="visitType">
                <option value="Dental">Dental</option>
                    <option value="General">General</option>
                    <option value="Gastroentrolgy">Gastroentrolgy</option>
                    <option value="Cardiolgy">Cardiolgy</option>
                    <option value="Skin Care">Skin Care</option>
                </select>
                
                </div>
                <div className="col input-container">
                <label className='labels' htmlFor="provider">Provider</label>
                <select onChange={(e) => setProvider(e.target.value)}  className='select-element'  value={provider} id="provider">
                <option value="Dr.Cris Patt" >Dr.Cris Patt</option>
                    <option value="Dr.Robert Downey">Dr.Robert Downey</option>
                    <option value="Dr.Andrew Grafield">Dr.Andrew Grafield</option>
                    <option value="Dr.Steven">Dr.Steven</option>
                    <option value="Dr.Peter Parker">Dr.Peter Parker</option>
                </select>
                </div>
            </div>
            <div  className="d-flex flex-sm-column flex-md-row">
                <div className="col input-container" >
                <label className="labels" htmlFor="start">Select a date</label>
                <input onChange={(e) => setAppDate(e.target.value)} className='input-element form-control' type="date" id="start" name="trip-start" value={appDate} min="2009-01-01" max="2028-12-31" />
                </div>
                <div className='col input-container'>
                    <label className='labels' htmlFor="time">Select a time</label>
                    <input  onChange={(e) => setAppTime(e.target.value)} value={appTime} type="time" min="09:00" max="18:00" required  className='input-element form-control' id="time" placeholder='Select a Time' />
                </div>
            </div>
        </div>
    )}

    const renderUpdateForm = () => (
        <form onSubmit={(e) =>  updateUserData(e)} className="container input-form">
           {renderFormSections()}
            <button className="submit-btn" type='submit'>Update</button>
        </form>
    )
 

    const onSubmitForm = async (e) => {
        e.preventDefault()
        validateUserInfo()
        

        usersData.forEach((user) => {
            if( user.firstName === firstName ||  user.email === email || phoneNumber === user.phoneNumber){
                     isExist = true
                     return
                }
                isExist = false
                 return
        })
     
        if (isExist){
            alert("User Already Exist!!")
            return
        }else{
          await axios.post("https://6543758001b5e279de206892.mockapi.io/api/v1/UserData",{firstName,lastName,email,phoneNumber,visitType,provider,appDate,appTime}).then(()=> getData())
        }
        setFirstName('')
        setLastName('')
        setEmail('')
        setPhoneNumber('')
        setVisitType('Dental')
        setProvider('Dr.Cris Patt')
        setAppDate(formattedDate)
        setAppTime(time)
    }


    const renderForm = () => (
        <form onSubmit={(e) => onSubmitForm(e)} className="container input-form">
           {renderFormSections()}
            <button disabled={buttonStatus} className="submit-btn" type='submit'>Submit</button>
        </form>
    )


    return(
        <div className="container">
            {update ? renderUpdateForm() : renderForm()}
            {renderTable()}
        </div>
    ) 
}


export default App