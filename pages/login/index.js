'use client'
import Link from 'next/link';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { setVerifyEmail } from '../../store/slices/userSlice';
const Login = () => {
  // const router = useRouter();
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")

  // const dispatch = useDispatch();
  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   dispatch(setUserEmail(email));
  //   var usersData = localStorage.getItem('users');
  //   if (usersData) {
  //     var oldData = JSON.parse(usersData);
  //     var res = oldData.filter(function (val) {
  //       return val.email === email && val.pass === password;
  //     });

  //     if (res.length > 0) {
  //       alert('Login Successful');
  //       dispatch(setLoginToken(true));
  //       router.push('/todo')
  //     }
  //     else if (confirmPassword !== password) {
  //       alert('Comfirm password not matched');
  //     }
  //     else {
  //       alert('Login Failed');
  //     }
  //   } else {
  //     alert("User doesn't exist. Please sign up first.");
  //   }
  // };
  const [fdata, setFdata] = useState({
    email: '',
    password: '',
    cpassword: ''
  });
  const [errormsg, setErrormsg] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const Sendtobackend = (e) => {
    e.preventDefault();

    if (fdata.email === '' || fdata.password === '') {
      setErrormsg('All fields are required');
      return;
    }
    else if (fdata.password != fdata.cpassword) {
      setErrormsg('Password and Confirm Password must be same');
      return;
    }
    else {
      fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fdata)
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setErrormsg(data.error);
          } else {
            alert('Logged in successfully');
            dispatch(setVerifyEmail(fdata.email));
            router.push('/todo')
          }
        })
        .catch(error => {
          alert(fdata.email + '\nPlease try later' + '\n' + error);
          console.log(error)
        });
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12">
        <h1 className="font-semibold text-3xl text-blue-700">Login</h1>
        <form id='form' name='form' onSubmit={Sendtobackend} className="space-y-12 w-full sm:w-[400px]">

          {errormsg ? <p style={styles.errormessage}>{errormsg}</p> : null}
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
          Need to create an account?{' '}
          <Link className="text-blue-700 hover:underline" href="/signup">
            Create Account
          </Link>{' '}
        </p>
      </div>
    </main>
  )
}
export default Login
const styles = {
  errormessage: {
    color: 'white',
    backgroundColor: 'red',
    borderRadius: 20,
    textAlign: 'center',
    paddingBottom: 6,
    padding: 5,
  },

}