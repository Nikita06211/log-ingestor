const SAVED_QUERIES_KEY = "savedSearchQueries";

export const getSavedQueries = () =>{
    const data = localStorage.getItem(SAVED_QUERIES_KEY);
    return data?JSON.parse(data):[];
};

export const saveQuery = (name,query)=>{
    const existing = getSavedQueries();
    const updated = [...existing.filter(q=> q.name!==name),{name,query}];
    localStorage.setItem(SAVED_QUERIES_KEY, JSON.stringify(updated));
};

export const deleteQuery = (name)=>{
    const updated = getSavedQueries().filter(q=>q.name!==name);
    localStorage.setItem(SAVED_QUERIES_KEY,JSON.stringify(updated));
}