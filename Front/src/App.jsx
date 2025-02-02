import './App.css';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import FindPage from './pages/FindPage';
import AccountPage from './pages/AccountPage';
import KakaoMap from './components/KakaoMap';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// CSS는 최상단에 로딩
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// JS 파일 순서 조정 및 중복 제거
import '@fortawesome/fontawesome-free/js/all.min.js';
import LoadingPage from './pages/LoadingPage';


function App() { 
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/join" element={<RegisterPage />} />
                <Route path="/find" element={<FindPage />}/>
                <Route path="/" element={<LoginPage />} />
                <Route path="/main" element={<LoadingPage />} />
                <Route path="/account" element={<AccountPage/>}/>
                <Route path="/test" element={<KakaoMap/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;