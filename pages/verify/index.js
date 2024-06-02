'use client'
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useSelector, useDispatch } from 'react-redux';
import { setVerifyEmail } from '@/store/slices/userSlice';
import { useRouter } from 'next/router';

const Verify = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMsg, setErrormsg] = useState(null);
    const [userCode, setUserCode] = useState(null);
    const userEmail = useSelector((state) => state.user.userEmail);
    const router = useRouter();
    const dispatch = useDispatch();
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get('code');
    useEffect(() => {
        const handleSave = async () => {
            if (!userCode) {
                setErrormsg('Code Doesnt exist! expired or not found');
                return;
            }
            else {
                try {
                    const fdata = {
                        email: userEmail,
                        code: userCode,
                    };
                    const response = await fetch('http://localhost:3001/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(fdata)
                    });
                    const data = await response.json();
                    if (data.success === true) {
                        alert(data.message);
                        router.push('/login');
                    }
                    else {
                        alert(data.error);
                        setErrormsg(data.error);
                        setIsModalOpen(true)
                    }
                } catch (error) {
                    console.error('Error during verification:', error);
                    alert("Internal server error ", error, " try again to verify");
                    router.push('/signup');
                }
            };
        }

        if (codeFromUrl) {
            setUserCode(codeFromUrl);
            handleSave();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [codeFromUrl, userCode]);

    const codeSend = async () => {
        const fdata = {
            email: userEmail,
        };
        try {
            const response = await fetch('http://localhost:3001/resend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fdata)
            });
            const data = await response.json();
            if (data.success === true) {
                setErrormsg(data.message);
                setIsModalOpen(true)
            }

            else {
                alert("Something went wrong !! Try Signing Up Again");
                router.push('/signup');
            }
        } catch (error) {
            console.error('Error during verification:', error);
            alert("Internal server error ", error, " try again to send code");
            setIsModalOpen(true)
        }
    }

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            ariaHideApp={false}
            style={customModalStyles}
        >
            <div style={styles.modalContent}>
                {errorMsg ? <p style={styles.errormessage}>{errorMsg}</p> : null}
                <h2 style={styles.modalTitle}>Verification Code</h2>
                <div style={styles.buttonContainer}>
                    <button onClick={codeSend} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4  focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send code</button>
                </div>
            </div>
        </Modal>
    );
};

export default Verify;

const styles = {
    modalContent: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 10,
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
    },
    errormessage: {
        color: 'white',
        backgroundColor: 'red',
        borderRadius: 20,
        textAlign: 'center',
        paddingBottom: 6,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20,
    },
};
const customModalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
};
