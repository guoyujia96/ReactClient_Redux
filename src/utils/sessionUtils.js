export default{
    saveItem(key,value){
        sessionStorage.setItem(key,value)
    },
    getItem(key){
        return sessionStorage.getItem(key)
    },
    removeItem(key){
        sessionStorage.removeItem(key)
    }
}