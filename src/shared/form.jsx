import { useState } from 'react'
import './form.css'

function LoginForm() {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [keepLogin, setkeepLogin] = useState(1);


    return (
        <form className='loginForm'>
            <div className='inputText'>
                {/* <label>帳號：</label> */}
                <input
                    type="text"
                    placeholder="帳號  Account"
                    value={account}
                    onChange={(e) => {
                        return setAccount(e.target.value);
                    }}
                    required />
            </div>
            <div className='inputText'>
                {/* <label>密碼：</label> */}
                <input
                    type="password"
                    placeholder="密碼  Password"
                    value={password}
                    onChange={(e) => {
                        return setPassword(e.target.value);
                    }}
                    required />
            </div>
            <div>
                <div className='switch_toggle'>
                    <p id='keepLoginText'>保持登入</p>
                    <label className="switch">
                        <input
                            type="checkbox"
                            name="keepLogin"
                            value={keepLogin}
                            onChange={(e) => {
                                return setkeepLogin(e.target.value);
                            }} />
                        <span className='slider round'></span>
                    </label>


                </div>
                <div className='loginBtnContainer'>
                    <button id='loginBtn' type="submit" >登入</button>
                </div>

            </div>

        </form>
    )
}
export default LoginForm