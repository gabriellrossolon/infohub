using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InfoHubApplication.Controllers
{
    [ApiController]
    [Route("api/v1/files")]
    public class FileController : ControllerBase
    {
        [Authorize]
        [HttpPost("{groupId:int}")]
        public async Task<IActionResult> UploadFile(int groupId, IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("Arquivo inválido");

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", groupId.ToString());
            Directory.CreateDirectory(uploadsPath);

            var filePath = Path.Combine(uploadsPath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new { path = $"Uploads/{groupId}/{file.FileName}" });
        }


        [Authorize]
        [HttpGet("{groupId:int}")]
        public IActionResult GetFilesByGroup(int groupId)
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", groupId.ToString());

            if (!Directory.Exists(uploadsPath))
            {
                return NotFound(new { message = "Nenhum arquivo encontrado para esse grupo." });
            }

            var files = Directory.GetFiles(uploadsPath)
               .Select(filePath => new
               {
                   FileName = Path.GetFileName(filePath),
                   FilePath = $"Uploads/{groupId}/{Path.GetFileName(filePath)}"
               })
               .ToList();

            return Ok(files);
        }


        [Authorize]
        [HttpGet("{groupId:int}/{fileName}")]
        public IActionResult DownloadFile(int groupId, string fileName)
        {
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", groupId.ToString());
            var filePath = Path.Combine(uploadsPath, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Arquivo não encontrado.");
            }

            // Tipo genérico, pode melhorar definindo MIME types
            var contentType = "application/octet-stream";

            return PhysicalFile(filePath, contentType, fileName);
        }


        [Authorize]
        [HttpDelete("{groupId:int}/{fileName}")]
        public IActionResult DeleteFile(int groupId, string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName))
                return BadRequest("Nome do arquivo inválido.");

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", groupId.ToString());
            var filePath = Path.Combine(uploadsPath, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Arquivo não encontrado.");

            try
            {
                System.IO.File.Delete(filePath);
                return Ok(new { message = "Arquivo deletado com sucesso." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro ao deletar o arquivo.", error = ex.Message });
            }
        }
    }
}
