import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ProjectDto, ProjectQueryDto } from './project.dto'
import { ProjectService } from './project.service'

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('find')
  @HttpCode(200)
  find(@Body() query: ProjectQueryDto): Promise<ProjectDto[]> {
    return this.projectService.find(query)
  }

  @Post()
  @HttpCode(200)
  create(@Body() project: ProjectDto): Promise<ProjectDto> {
    return this.projectService.create(project)
  }

  @Get(':projectId')
  @HttpCode(200)
  read(@Param('projectId') projectId: string): Promise<ProjectDto> {
    return this.projectService.read(projectId)
  }

  @Put(':projectId')
  @HttpCode(200)
  update(@Param('projectId') projectId: string, @Body() projectDto: ProjectDto): Promise<ProjectDto> {
    projectDto.projectId = projectId
    return this.projectService.update(projectDto)
  }

  @Delete(':projectId')
  @HttpCode(200)
  delete(@Param('projectId') projectId: string): Promise<void> {
    return this.projectService.delete(projectId)
  }
}
