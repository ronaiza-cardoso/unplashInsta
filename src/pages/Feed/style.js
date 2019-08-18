import styled from 'styled-components/native'

export const Post = styled.View``

export const Header = styled.View`
    padding: 15px;
    flex-direction: row;
    align-items: center;
    background-color: #f4f4f4;
`

export const Avatar = styled.Image`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    margin-right: 10px;
`

export const Name = styled.Text`
    color: #333;
    font-weight: bold;
`

export const PostDescription = styled.Text`
    padding: 15px 5px;
    margin-bottom: 15px;
    line-height: 18px;
`
export const Loading = styled.ActivityIndicator.attrs({
    size: 'small',
    color: '#999'
})`
    margin: 30px 0;

`