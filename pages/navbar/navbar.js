import { useDispatch } from 'react-redux';
import { setVerifyEmail } from '../../store/slices/userSlice';
const Navbar = () => {
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(setVerifyEmail(null));
        alert("Succesfully Logout")
    }
    return (
        <div className="container px-5 mx-auto flex flex-wrap items-center">
            <button onClick={logout} className="text-white bg-red-500 border-10 py-2 px-8 mt-2  focus:outline-none w-fit hover:bg-red-400 rounded text-lg">Logout</button>
        </div>
    )
}
export default Navbar