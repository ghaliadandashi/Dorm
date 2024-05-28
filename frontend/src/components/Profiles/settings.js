import React, {useState} from 'react'
import '../../styling/components/settings.css'
import axios from "axios";
import {useNotification} from "../../layout/Notifications";
import LanguageSelector from "../LanguageSelector";
import {useAuth} from "../Auth/AuthHook";


const Settings = ()=>{
    const [pass,setPass]= useState('')
    const {addNotification} = useNotification()
    const {role} = useAuth()
    const handleChangePassword = ()=>{
        axios.put('http://localhost:3001/api/changePassword',{pass},{withCredentials:true})
            .then(
                addNotification('Password updated successfully!','success'),
                setPass('')
            )
            .catch(error=>{
                addNotification('Error updating password!','error')
            })
    }
    return(
        <div className='settings-container'>
            {role !=='student'?
                <div className='change-Pass'>
                    <h2>Change Password</h2>
                    <div>
                        <input style={{padding:'8px 20px',outline:'0',border:'none',backgroundColor:'black',color:'white'}} value={pass} onChange={(e) => setPass(e.target.value)} type='text'/>
                        <button onClick={handleChangePassword}>Change</button>
                    </div>
                </div>:null
            }

            <div>
                <h2>
                    Language Preference
                </h2>
                <div>
                    <LanguageSelector/>
                </div>
            </div>
        </div>
    )
}

export default Settings;