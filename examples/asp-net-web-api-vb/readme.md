# TodoREST - ASP.NET Web API (VB.NET)

> This is a placeholder; the actual VB.NET source code does not yet exist.
> It should be a straighforward port from the C# version.

## Setup

Instructions below are for Windows 8.1 Professional running IIS 8.5 and Visual Studio 2013 Professional.
Minor adjustments might be needed if you are using different versions of Windows, IIS, or VS.

1. Open IIS.
1. Create a new Application Pool with the following characteristics:
    - Name: TodoREST.AspNetWebApiVB
    - .NET CLR version: .NET CLR Version v4.0.30319
    - Managed pipeline mode: Integrated
    - Start application pool immediately: (checked)
1. Right-click on *Default Web Site* (under *Sites*) and select "Add Application..."
1. In the *Add Application* dialog, enter the following characteristics and then click "OK"
    - Alias: TodoREST.AspNetWebApiVB
    - Application pool: Select... > TodoREST.AspNetWebApiVB > OK
    - Physical path: Full path to your *asp-net-web-api-vb* directory
1. Open the *TodoRest.AspNetWebApiVB.sln* solution file in Visual Studio 2013
1. Compile the solution (Ctrl-Shift-B). (This may take a while the first time, as it needs to download packages from NuGet.)
1. Open [http://localhost/TodoREST.AspNetWebApiVB/api/todos](http://localhost/TodoREST.AspNetWebApiVB/api/todos)
   in your browser to ensure that it works. It should return an empty array as the following JSON: `[]`