class DB {
    Get(key) {
        return localStorage.getItem(key);
    }
    Set(key, value) {
        localStorage.setItem(key, value);
    }
    Remove(key) {
        localStorage.removeItem(key);
    }
}