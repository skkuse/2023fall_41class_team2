import './MainPage.scss'
import Banner from '../assets/banner-image.png';
import CodeInput from '../assets/code-input.png'
const MainPage = () => {

    return (
        <div className='main'>
            <div className='main_container'>
                <div className='main_banner'>
                    <div className='main_banner_text'>
                        <div className='main_banner_title'>
                            <span className='main_banner_title_1'>E</span>
                            <span className='main_banner_title_2'>code</span>
                        </div>
                        <div className='main_banner_description'>
                            <span>
                                Input your code<br/>
                                Calculate carbon footprint
                            </span>
                        </div>
                        <div className='main_banner_button'>
                         
                            <button type='button' onClick={(e) => { e.preventDefault(); location.href='/'; }}>Get started ➝</button>
                        </div>
                    </div>
                    <img src={Banner} className='main_banner_img' />
                </div>
                <div className='main_context'>
                    <div className='main_context_text'>
                        <span >253.64g CO2e</span>
                    </div>
                    <img className='main_context_img' src={CodeInput}/>

                </div>
            </div>
        </div>
    );
}

export default MainPage;