import { addItem, run } from './../03-utils';
import {
    first,
    last,
    elementAt,
    min,
    max,
    find,
    findIndex,
    single,
    tap,
    map,
    pluck,
    switchMap,
    withLatestFrom, ignoreElements, switchMapTo, reduce, filter, takeWhile, distinctUntilKeyChanged
} from 'rxjs/operators';
import { from, fromEvent, of, EMPTY, MonoTypeOperatorFunction, Observable, combineLatest, forkJoin } from 'rxjs';
import { ajax } from 'rxjs/ajax';

// Task 1. first()
// Создайте поток объектов с двумя свойствами: action и priority
// Получите первый объект из потока с высоким приоритетом
(function task1(): void {
    const items = [
        { action: 'merge', priority: 'low' },
        { action: 'rebase', priority: 'middle' },
        { action: 'push', priority: 'high' },
    ];
    const stream$ = from(items).pipe(
        first(({ priority }) => priority === 'high'),
    );

    // run(stream$);
})();

// Task 2. last()
// Создайте поток слов из предложения 'Мягкое слово кости не ломит'. Получите последнюю слово, которое содержит 2 символа
(function task2(): void {
    const word = 'Мягкое слово кости не ломит'
    const splitedWord = word.split(' ');
    const stream$ = from(splitedWord).pipe(
        last((substr: string) => substr.length === 2),
    );

    // run(stream$);
})();


// Task 3. elementAt()
// Создайте поток событий клик по документу. Получите второй объект события клик.
(function task3(): void {
    const targetIndex = 1;
    const clickEvent$ = fromEvent(document, 'click');
    const stream$ = clickEvent$.pipe(
        elementAt(targetIndex),
    );

    // run(stream$, { outputMethod: "console"});
})();

// Task 4. min() (Vitalii Puzakov)
// Создайте поток слов из предложения 'Мягкое слово кости не ломит'. Найдите минимальную длину слова в предложении.
(function task4() {
    const string = 'Мягкое слово кости не ломит';
    const splittedString = string.split(' ');
    const source$ = from(splittedString).pipe(
        map((substr: string) => substr.length),
        min(),
    );

    // run(source$);
})();


// Task 5. max()
// Создайте поток объектов с двумя свойствами: title, quantity.
// Получите объект с максимальным значением quantity
(function task5() {
    const items = [
        { title: 'watter', quantity: 2 },
        { title: 'bread', quantity: 3 },
        { title: 'potato', quantity: 20 },
    ];
    const stream$ = from(items).pipe(
        max((a, b) => a.quantity - b.quantity),
    );

    // run(stream$);
})();

// Task 6. find() (Andrii Olepir)
// Создайте поток, используя ajax(`https://jsonplaceholder.typicode.com/users`)
// Получите первого пользователя, email которого, заканчивается на 'biz'
(function task6() {
    const request$ = ajax(`https://jsonplaceholder.typicode.com/users`);
    const targetEnding = 'biz';
    const stream$ = request$.pipe(
        switchMap(({ response } )=> from(response)),
        first(({ email }) => email.endsWith(targetEnding)),
    );

    // run(stream$);
})();

// Task7. findIndex()
// Создайте поток объектов с двумя свойствами: id, name.
// Получите номер объекта в потоке, у которого длина name больше 10 символов
(function task7() {
    const items = [
        { id: 1, name: 'Max33333' },
        { id: 2, name: 'Andrei123123123' },
        { id: 3, name: 'Ivan222' },
        { id: 4, name: 'Iryna32323' },
    ];
    const stream$ = from(items).pipe(
        findIndex(({ name }) => name.length > 10),
    );

    // run(stream$);
})();

// Task 8. single()
// Создайте поток объектов с двумя свойствами: title, priority так, чтобы некоторые объекты
// имели одинаковые значения title
// Получите объект у которого title = 'Learn RxJS', если он единственный в потоке
(function task8() {
    const targetTitle = 'Learn RxJS';
    const items = [
        { title: 'JS', priority: 0 },
        { title: 'TS', priority: 1 },
        { title: 'Learn RxJS', priority: 1 },
        { title: 'Angular', priority: 0 },
        { title: 'TS', priority: 1 },
    ];
    const stream$ = from(items).pipe(
        single(({ title }) => title === targetTitle ),
    );

    // run(stream$);
})();

// HOMEWORK

// Task 9. ignoreElements()
// Создать поток объектов, представляющих пользователей, с полями id и entriesCount.
// Представим, что пользователь логинится в приложение.
// При логине  пользователя - надо резолвнуть его entriesCount по id из ранее созданного потока пользователей.
// Нужно зарегестрировать вход пользователя c помощью функции registerUserLogin$
// Регистрация входа пользователя возвращает не нужные данные, нам надо только знать прошла она успешно или нет.
(function task9() {
    // Допустим, что фунция registerUserLogin$ сама умеет регистрировать вход текущего пользователя
    const registerUserLogin$ = () => of(EMPTY);
    const userLogin$ = of( { id: 'someId4', email: 'mocked_email4@gmai.com', entriesCount: 400 })
    const users$ = of([
        { id: 'someId1', entriesCount: 100 },
        { id: 'someId2', entriesCount: 200,},
        { id: 'someId3', entriesCount: 300 },
        { id: 'someId3', entriesCount: 120 },
        { id: 'someId4', entriesCount: 400 },
    ]);

    const stream$ = userLogin$.pipe(
        withLatestFrom(users$),
        map(([loginUser, allUsers]) => allUsers.find((dbUser) => dbUser.id === loginUser.id)?.entriesCount),
        switchMapTo(registerUserLogin$()),
        ignoreElements(),
    );

    // run(stream$);
})();
// Task 10. Написать свой RX оператор для фильтрации массива, чтобы избежать вложенности filter() в map().
// Использовать его, чтобы отфильтровать поток пользователей из задачи 9, по entriesCount
// оставляя только те, которые большк 100. Оставшиеся значения - нужно собрать в один массив.
(function task10() {
const filterArray = <T>(
    filterFunction: (value: T, index?: number, array?: T[]) => boolean,
): MonoTypeOperatorFunction<T[]> => (source: Observable<T[]>): Observable<T[]> => {
    return source.pipe(
        map((array: T[]) => array.filter(filterFunction)),
    );
};

const users$ = of([
    { id: 'someId1', entriesCount: 100 },
    { id: 'someId2', entriesCount: 200,},
    { id: 'someId3', entriesCount: 300 },
    { id: 'someId3', entriesCount: 120 },
    { id: 'someId4', entriesCount: 400 },
]);

    const stream$ = from(users$).pipe(
        filterArray(({ entriesCount }) => entriesCount > 100),
        reduce((memo, user) => [...memo, user], []),
    );

    // run(stream$);
})();

// Task 11
// Создайте два потока объектов, с полями id, name. Проверьте, является ли первый элемент элемент из первого потока
// равен посленему из второго по id. Если да - нужно показать поле name из первого объекта
// если нет - поток должен завершиться
(function task11() {
    const items1 = from([
        { id: 'someId1', name: 'Elena' },
        { id: 'someId2', name: 'Andrei',},
        { id: 'someId2', name: 'Anna',},
    ]).pipe(first());

    const items2 = from([
        { id: 'someId5', name: 'George' },
        { id: 'someId6', name: 'Michael',},
        { id: 'someId1', name: 'Elena' },
    ]).pipe(last());

    const stream$ = forkJoin([items1, items2]).pipe(
        takeWhile(([first, last]) => first.id === last.id),
        map(([first]) => first.name),
    );

    // run(stream$);
})();

// Task 12
// В базе данниз лежат битые объекты. При регистрации юзеров записывало дважды и не всегда верно.
// Нужно найти первого, целого, уникального пользователя.
// Создайте поток из объектов и полями id, name.
// В этом потоке, должны быть объекты с повторяющимеся значениями name и периодческие пустыми id.
// Получите из этого потока первого пользвателя, у которого name, отличное от предыдущего и имеется значение id.
// В случае, если такого пользователя нет - верните дефолтный объект.
(function task12() {
    const items$ = from([
        { id: '', name: 'Elena' },
        { id: 2, name: 'Elena' },
        { id: '', name: 'Andrei' },
        { id: '', name: 'Andrei' },
        { id: 4, name: 'Max' },
        { id: 4, name: 'Anna' },
    ]);
    const key = 'name';
    const fallBackItem = { id: '0', name: 'Jonas'};

    const stream$ = items$.pipe(
        distinctUntilKeyChanged(key),
        first(({ id }) => !!id, fallBackItem),
    );

    // run(stream$);
})();

export function runner() {}