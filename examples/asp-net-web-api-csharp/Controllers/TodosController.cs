using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace TodoRest.AspNetWebApiCSharp.Controllers
{
    public class TodosController : ApiController
    {
        // GET api/todo
        public List<Todo> Get()
        {
			return TodosRepository.GetAll();
        }

        // GET api/todo/5
		public Todo Get(int id)
        {
			return TodosRepository.GetById(id);
        }

        // POST api/todo
		public HttpResponseMessage Post([FromBody]Todo todo)
        {
			int newId = TodosRepository.Add(todo);
			var responseObject = TodosRepository.GetById(newId);
			var response = Request.CreateResponse(HttpStatusCode.Created, responseObject);
			response.Headers.Location = new Uri(Url.Link("DefaultApi", responseObject));
			return response;
        }

        // PUT api/todo/5
		public HttpResponseMessage Put(int id, [FromBody]Todo todo)
        {
			bool wasFound = TodosRepository.Update(todo);

			if (wasFound)
			{
				return Request.CreateResponse(HttpStatusCode.NoContent);
			}
			else
			{
				throw new HttpResponseException(HttpStatusCode.NotFound);
			}
        }

        // DELETE api/todo/5
		public HttpResponseMessage Delete(int id)
        {
			bool wasFound = TodosRepository.Delete(id);

			if (wasFound)
			{
				return Request.CreateResponse(HttpStatusCode.NoContent);
			}
			else
			{
				throw new HttpResponseException(HttpStatusCode.NotFound);
			}
        }

		[HttpGet]
		[Route("api/ClearTodos")]
		public HttpResponseMessage ClearTodos()
		{
			TodosRepository.Clear();
			return Request.CreateResponse(HttpStatusCode.NoContent);
		}
    }
}
