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
        public List<Todo> Get()
        {
			return TodosRepository.GetAll();
        }

		public Todo Get(int id)
        {
			return TodosRepository.GetById(id);
        }

		public HttpResponseMessage Post([FromBody]Todo todo)
        {
			int newId = TodosRepository.Add(todo);
			var responseObject = TodosRepository.GetById(newId);
			var response = Request.CreateResponse(HttpStatusCode.Created, responseObject);
			response.Headers.Location = new Uri(Url.Link("DefaultApi", responseObject));
			return response;
        }

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

		// NOTE: This "delete everything" method is not recommended for a typical REST API.
		//       It's only included here for ease of testing, so we can quickly reset back to a blank slate.
		public HttpResponseMessage Delete()
		{
			TodosRepository.Clear();
			return Request.CreateResponse(HttpStatusCode.NoContent);
		}
    }
}
