import styled from 'styled-components'


function UartConnectionError(){
    return <UartConnectionErrorText>USB PORT CONNECTION ERROR</UartConnectionErrorText>
}
const UartConnectionErrorText = styled.div`
    display: flex;
    align-items: center;
    justify-self: center;
    font-size: 25px;
    font-weight: bold;
    margin: auto;
`
export default UartConnectionError