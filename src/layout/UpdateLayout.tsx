import React from 'react';
import styled from 'styled-components'

type updateState = 'updateAvailable' | 'updateNotAvailable' | 'networkError' | 'updating' | 'updateFinish' | 'updateCheck'

interface UpdateLayoutProp{
    currentVersion:string;
    latestVersion:string;
    stateString: updateState;
}

function UpdateLayout({currentVersion,latestVersion,stateString} : UpdateLayoutProp){
    let s : string = ""
    switch (stateString) {
        case 'networkError':
            s = "Network not connected"
            break;
        case 'updateAvailable':
            s = "Update available"
            break;
        case 'updateFinish':
            s = "Update finished"
            break;
        case 'updateNotAvailable':
            s = "Current version is the latest"
            break;
        case 'updating':
            s = "Updating"
            break;
        case 'updateCheck':
            s = "Update Check"
            break;
        default:
            break;
    }
    return (
        <UpdateInfoArea>
            <UpdateInfo>{s}</UpdateInfo>
            <VersionInfoArea>
                <VersionText>Current Version</VersionText>
                <VersionValue>{currentVersion}</VersionValue>
                <VersionText>Latest version</VersionText>
                <VersionValue>{latestVersion}</VersionValue>
            </VersionInfoArea>
        </UpdateInfoArea>
    );
}
const UpdateInfoArea = styled.div`
    display: flex;

    flex-direction: column;
    align-items: flex-start;
`
const UpdateInfo = styled.div`
    color: #474747;
    font-size:25px;

    align-self: left;
    justify-self: left;
    margin-left: 15px;
    margin-bottom: 10px;
    margin-top: -15px;
`
const VersionInfoArea = styled.div`
    display: grid;

    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    justify-items: start;
    align-items: center;

    background-color: #ffffff;
    width: 450px;
    height: 115px;
    border-radius: 8px;

`
const VersionText = styled.div`
    color: #474747;
    font-size:23px;
    margin-left: 15px;
`
const VersionValue = styled.div`
    color: #474747;
    font-size:23px;
    font-weight: bold
`
export default UpdateLayout;