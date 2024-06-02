// import { Alert } from '@/components/ui/alert'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { setUserEmail } from "../../store/slices/userSlice";
import { useSelector } from "react-redux";
const Signup = () => {
  // const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('')
  // const dispatch = useDispatch();
  // const router = useRouter();
  // const handleSignup = (e) => {
  //   e.preventDefault();
  //   var usersData = localStorage.getItem('users');

  //   var userObj = {
  //     username,
  //     email,
  //     pass: password,
  //   };
  //   dispatch(setUserEmail(email));
  //   if (usersData) {
  //     var oldData = JSON.parse(usersData);
  //     var res = oldData.filter(function (val) {
  //       return val.email === email;
  //     });

  //     if (res.length > 0) {
  //       alert('User email already exists');
  //     }
  //     else if (confirmPassword !== password) {
  //       alert('Comfirm password not matched');
  //     }
  //     else {
  //       signUpUser(userObj, oldData);
  //     }
  //   } else {
  //     signUpUser(userObj);
  //   }

  // }
  // const signUpUser = (userObj, oldData = []) => {
  //   oldData.push(userObj);
  //   localStorage.setItem('users', JSON.stringify(oldData));
  //   alert('Signup Successful');
  //   dispatch(setLoginToken(true));
  //   router.push('/todo');
  // };
  const dispatch = useDispatch();
  const router = useRouter();
  const [errormsg, setErrormsg] = useState(null);
  const [fdata, setFdata] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fdata.name || !fdata.email || !fdata.password || !fdata.cpassword) {
      setErrormsg('All fields are required');
      return;
    }
    if (fdata.password !== fdata.cpassword) {
      setErrormsg('Password and Confirm Password must be same');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fdata)
        
      });
      dispatch(setUserEmail(fdata.email))
      const data = await response.json();
      if (data.success === true) {
        setErrormsg(data.message);
      }
      else {
        alert(data.error);
        setErrormsg(data.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrormsg('An error occurred: ', error, ' Please try again.');
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
        <h1 className="font-semibold text-3xl  text-blue-700">Signup</h1>
        <form onSubmit={handleSignUp} className="space-y-12 w-full sm:w-[400px]">
          {errormsg ? <p style={styles.errormessage}>{errormsg}</p> : null}
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >UserName</label>
            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required

              onChange={(e) => setFdata({ ...fdata, name: e.target.value })}
              onFocus={() => setErrormsg(null)}
              id="username"
              type="text" />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email address</label>
            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required
              onChange={(e) => setFdata({ ...fdata, email: e.target.value })}
              onFocus={() => setErrormsg(null)}
              id="email"
              type="email" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••"
              required
              onChange={(e) => setFdata({ ...fdata, password: e.target.value })}
              onFocus={() => setErrormsg(null)}
              id="password"
              type="password" />
          </div>
          <div className="mb-6">
            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
            <input type="password" id="confirm_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••"
              required
              onChange={(e) => setFdata({ ...fdata, cpassword: e.target.value })}
              onFocus={() => setErrormsg(null)}
            />
          </div>
          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>
        <p className="text-center">
          No Need to create an account?{' '}
          <Link className="text-blue-700 hover:underline" href="/login">
            Login Now
          </Link>{' '}
        </p>
      </div>
    </main>
  )
}
export default Signup;
const styles = {
  errormessage: {
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 20,
    textAlign: 'center',
    paddingBottom: 6,
    padding: 5,
  }
}