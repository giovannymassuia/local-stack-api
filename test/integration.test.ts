import { getApiUrl } from './localstack';

test('get stack outputs', async () => {
    const apiUrl = await getApiUrl();
    console.log('apiUrl:', apiUrl);
});

test('create todo', async () => {
    const apiUrl = await getApiUrl();

    // https  request
    const createTodoResponse = await fetch(`${apiUrl}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'test todo'
        })
    });

    const createTodoResponseBody = await createTodoResponse.json();
    expect(createTodoResponse.status).toBe(201);
    expect(createTodoResponseBody.data.id).toBeDefined();
    expect(createTodoResponseBody.data.name).toBe('test todo');

    const getTodosResponse = await fetch(`${apiUrl}/todos/${createTodoResponseBody.data.id}`);
    const getTodosResponseBody = await getTodosResponse.json();

    expect(getTodosResponse.status).toBe(200);
    expect(getTodosResponseBody.data.id).toBe(createTodoResponseBody.data.id);
    expect(getTodosResponseBody.data.name).toBe(createTodoResponseBody.data.name);
});
