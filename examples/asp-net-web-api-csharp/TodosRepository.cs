using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace TodoRest.AspNetWebApiCSharp
{
    // NOTE:
    // 
    // This class is a placeholder for what would normally be a full-fledged Data Access Layer
    // targeting a database instead of an in-memory collection.
    //
    // An actual production REST API would not contain a class like this, but would instead call
    // corresponding methods of a BLL or DAL class.
    //
    public static class TodosRepository
    {
        private static object lockObject = new object();
        private static int nextTodoId = 1;
        private static List<Todo> todos = new List<Todo>();

        public static List<Todo> GetAll()
        {
            return todos;
        }

        public static Todo GetById(int id)
        {
            return todos.Where(t => t.Id == id).FirstOrDefault();
        }

        public static int Add(Todo todo)
        {
            lock (lockObject)
            {
                todo.Id = nextTodoId;
                Interlocked.Increment(ref nextTodoId);
                todos.Add(todo);
            }
            return todo.Id;
        }

        public static bool Update(Todo todo)
        {
            lock (lockObject)
            {
                Todo existingTodo = todos.Where(t => t.Id == todo.Id).FirstOrDefault();
                if (existingTodo == null)
                {
                    return false;
                }
                else
                {
                    todos.Remove(existingTodo);
                    todos.Add(todo);
                    return true;
                }
            }
        }

        public static bool Delete(int id)
        {
            lock (lockObject)
            {
                Todo existingTodo = todos.Where(t => t.Id == id).FirstOrDefault();
                if (existingTodo == null)
                {
                    return false;
                }
                else
                {
                    todos.Remove(existingTodo);
                    return true;
                }
            }
        }

        // hook for testing
        public static void Clear()
        {
            todos.Clear();
            nextTodoId = 1;
        }
    }
}