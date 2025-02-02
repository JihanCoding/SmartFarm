import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import Footer from "../components/Footer";
import CustomAlert from "../components/CustomAlert";

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [isRemember, setRemember] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        // 세션에 이메일이 있으면 로그인된 상태로 판단하고 메인 페이지로 이동
        if (sessionStorage.getItem("email")) {
            navigate('/main');
        }

        if(sessionStorage.getItem("pw")){
            handleLoadPassword();
            setRemember(true);
            setFormData((prev) => ({ ...prev, pw: sessionStorage.getItem("pw") }));
        }
      }, []); // 의존성 배열이 빈 경우, 컴포넌트 마운트 시 1회만 실행됩니다.

    const handleSavePassword = () => {
        if(isRemember){
            // setCookie('password', formData.pw, {
            //     path: '/',
            //     maxAge: 3600, // 1시간 후 만료
            //     secure: true,  // HTTPS 연결에서만 사용
            //     httpOnly: false,  // JavaScript에서 접근 가능 (보안상 위험)
            //     sameSite: 'Strict' 
            //   });
            sessionStorage.setItem("pw", formData.pw);
        }
        // setCookie('email', formData.email, {
        //     path: '/',
        //     secure: true,  // HTTPS 연결에서만 사용
        //     httpOnly: false,  // JavaScript에서 접근 가능 (보안상 위험)
        //     sameSite: 'Strict' 
        //   });
      };
    const handleLoadPassword = () => {
        setFormData((prev) => {
            const updatedFormData = {
                ...prev,
                pw: String(sessionStorage.getItem("pw") ?? '')  // `pw` 필드만 업데이트
            };
            return updatedFormData;
        });
    };

    const [formData, setFormData] = useState({
        email: '',
        pw: ''
    });

    const [errors, setErrors] = useState({
        emailError: '',
    });

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // ✅ 실시간으로 값이 바뀔때
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value ?? ''};
    
            // 이메일 검사
            if (name === 'email') {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    emailError: value.trim() === '' 
                        ? '이메일을 입력해주세요.'
                        : validateEmail(value) 
                            ? '' 
                            : '유효한 이메일을 입력해주세요.'
                }));
            }
            return updatedFormData;
        });
    };
    // ✅ 폼태그 제출시
    const handleSubmit = async(event) => {
        event.preventDefault();
        let valid = true;
        let check = true;
    
        // 🔥 모든 필드 검사
        for (const key of Object.keys(formData)) {
            if (formData[key].trim() === '') {
                valid = false;
                CustomAlert({
                    title: '주의',
                    text: '모든 필드는 필수입니다.',
                    icon: 'warning',
                    confirmButtonText: '확인',
                  });
                  check = false;
                break;  // 🔥 빈 필드가 발견되면 반복 중단
            }
        }
        if(valid){
            try {
                const checkEmail = await axios.post('/focus/api/user/check', formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                console.log('아이디 중복체크 서버 응답:', checkEmail.data);
                if (checkEmail.data === false) {
                    check = false;
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        emailError: '이메일을 다시 확인하세요.'
                    }));
                }
            } catch (error) {
                console.error('서버 오류:', error);
                check = false;
            }
        }
        if (check) {
            console.log('로그인 정보:', formData);
            // ✅ 서버로 데이터 전송 (POST 요청)
            try {
                const response = await axios.post('/focus/api/user/login', formData, {
                    headers: {
                    'Content-Type': 'application/json'
                    },withCredentials: true});
                console.log('서버 응답:', response.data);
                if(response.data){
                    await CustomAlert({
                        text: '로그인 성공!',   // 메시지 내용만 전달
                        icon: 'success',       // 성공 아이콘으로 변경
                        confirmButtonText: '확인',
                      });
                    handleSavePassword();
                    sessionStorage.setItem("email", response.data.user_email);
                    sessionStorage.setItem("name", response.data.user_name);
                    navigate('/main');
                }
                else{
                    CustomAlert({
                        text: '비밀번호를 다시 확인하세요.',  // 메시지 내용
                        icon: 'error',                      // 오류 메시지이므로 'error' 아이콘 사용
                        confirmButtonText: '확인',
                      });
                    console.log('로그인 실패');
                }

            } catch (error) {
                console.error('서버 오류:', error);
        }
        }
    };

    return (
        <div id="layoutAuthentication">
             {loading &&(
            <div className="loading-back"><Spinner className="loading-ui" animation="border" variant="primary" /></div>
            )}
            <div id="layoutAuthentication_content">
                <main>
                    <div className="container-xl px-4 custom_page">
                        <div className="row justify-content-center">
                            <div className="col-lg-5">
                                {/* Basic login form*/}
                                <div className="card shadow-lg border-0 rounded-lg mt-5 custom_wrap">
                                    <div className="card-header justify-content-center custom_header">
                                        <h3 className="fw-light my-4">로그인</h3>
                                    </div>
                                    <div className="card-body">
                                        {/* Login form*/}
                                        <form onSubmit={handleSubmit} id='loginForm'>
                                            {/* Form Group (email address)*/}
                                            <div className="mb-3">
                                                <label
                                                    className="small mb-1"
                                                    htmlFor="inputEmailAddress"
                                                >
                                                    이메일
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="inputEmailAddress"
                                                    type="email"
                                                    placeholder="Enter email address"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                                <span style={{ color: 'red' }}>{errors.emailError}</span>
                                            </div>
                                            {/* Form Group (password)*/}
                                            <div className="mb-3">
                                                <label
                                                    className="small mb-1"
                                                    htmlFor="inputPassword"
                                                >
                                                    비밀번호
                                                </label>
                                                <input
                                                    className="form-control"
                                                    id="inputPassword"
                                                    type="password"
                                                    placeholder="Enter password"
                                                    name="pw"
                                                    value={formData.pw}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {/* Form Group (remember password checkbox)*/}
                                            <div className="mb-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        id="rememberPasswordCheck"
                                                        type="checkbox"
                                                        defaultValue=""
                                                        checked={isRemember}  // ✅ 쿠키 기반 체크 상태
                                                        onChange={() => setRemember(!isRemember)}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="rememberPasswordCheck"
                                                    >
                                                        비밀번호 기억하기
                                                    </label>
                                                </div>
                                            </div>
                                            {/* Form Group (login box)*/}
                                            <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                <a
                                                    className="small"
                                                    href="#"
                                                    onClick={()=>{navigate("/find")}}
                                                >
                                                    비밀번호가 기억이 안나시나요?
                                                </a>
                                                <a
                                                    className="btn btn-primary"
                                                    href="#"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        document.getElementById('loginForm').requestSubmit();
                                                    }}
                                                >
                                                    로그인하기
                                                </a>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer text-center">
                                        <div className="small">
                                            <a href="#" onClick={()=> {navigate('/join')}}>
                                                계정이 없으신가요?
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div id="layoutAuthentication_footer">
                <Footer />
            </div>
        </div>
    );
}
export default LoginPage;
