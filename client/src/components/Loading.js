const Loading = ({ center , leaveTop = false}) => {
    if(leaveTop){
        return <div className={center ? 'loading loading-center loading-leaveTop' : 'loading loading-leaveTop'}></div>
    }
    return <div className={center ? 'loading loading-center' : 'loading'}></div>
}

export default Loading
