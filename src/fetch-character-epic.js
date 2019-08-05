import { ajax } from 'rxjs/ajax';
import { ofType } from 'redux-observable';
import { map, mergeMap, tap, takeUntil } from 'rxjs/operators';
import { FETCH_CHARACTERS, fetchCharactersFulfilled } from './actions';
    
const ENDPOINT = 'http://star-wars-characters.glitch.me/api/search/';

const fetchCharactersEpic = (action$) => {
    return action$.pipe(
        ofType(FETCH_CHARACTERS),
        tap(value => console.log('Gonna fetch', value)),
        mergeMap(action => 
            ajax.getJSON(ENDPOINT + action.payload.searchTerm)
            .pipe(
                map(response => fetchCharactersFulfilled(response.results)),
                takeUntil(
                    action$.pipe(
                        tap(value => console.log('CANCELLING!', value)),
                        ofType(FETCH_CHARACTERS)
                    ),
                ),
            ),
        ),
    );
};

export default fetchCharactersEpic; 