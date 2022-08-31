import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import styled from 'styled-components'


function FactoryReset(){
    const navigate = useNavigate()
    
    const [clickCount, setclickCount] = useState(0)
    const [waitModalVisible, setwaitModalVisible] = useState(false)
    return (
        <div>
            <Header>
            </Header>
            <Footer>
            </Footer>
            <Modal selectVisible={true} selectString={clickCount == 2 ? "Reset" : "Yes"} visible={true} onBackClicked={()=>{navigate(-1)}} onSelectClicked={()=>{
                if(clickCount >= 2){
                    window.electronAPI.factoryRestRM()
                    setwaitModalVisible(true)
                }setclickCount(clickCount+1)
            }}>
                <FactoryResetArea>
                    <FactoryResetTextBold>
                        {
                            "공장 초기화를 진행하시겠습니까? ("+clickCount+"/2)"
                        }
                    </FactoryResetTextBold>
                    <FactoryResetText>
                        공장 초기화 진행시 제품이 다시 켜질때까지 전원을 제거하지 마십시오.
                    </FactoryResetText>
                    <FactoryResetText>
                        전원 제거시 문제가 발생할 수 있습니다.
                    </FactoryResetText>
                </FactoryResetArea>
            </Modal>
            <Modal selectVisible={false} backVisible={false} visible={waitModalVisible}>
                <FactoryResetArea>
                    <FactoryResetText>
                        공장 초기화가 진행중입니다.
                    </FactoryResetText>
                    <FactoryResetText>
                        전원을 제거하지 마십시오.
                    </FactoryResetText>
                </FactoryResetArea>
            </Modal>
        </div>
    );
}
const FactoryResetArea = styled.div`

    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;

    row-gap: 10px;
`
const FactoryResetTextBold = styled.div`

    font-weight: bold;
    font-size: 18px;

    justify-content: center;

`
const FactoryResetText = styled.div`
    font-size: 18px;

    justify-content: center;

`
export default FactoryReset