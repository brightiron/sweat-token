import { Box, Button, CircularProgress, Grid, InputAdornment, TextField } from '@mui/material'
import React, { FormEvent, useCallback, useState } from 'react'
import { createProject } from '../../../api'
import { CreateProjectDto, ProjectDtoStatusEnum } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useDao from '../../../context/DaoContext'
import useToast from '../../../context/ToastContext'

export default function ProjectAdd() {
  const { daoId } = useDao()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    daoId,
    status: ProjectDtoStatusEnum.Open
  } as Record<string, any>)

  const [validFields, setFormValidation] = useState({} as Record<string, boolean>)

  // return true if fields are valid
  const checkValidFields = useCallback(
    (...fieldNames: string[]): boolean => {
      const validation = {} as Record<string, boolean>

      const isValid =
        fieldNames
          .map((fieldName) => {
            const empty = !formValues[fieldName]
            validation[fieldName] = empty
            return validation[fieldName]
          })
          .filter((error) => error).length === 0

      setFormValidation({
        ...validFields,
        ...validation
      })

      return isValid
    },
    [validFields, formValues]
  )

  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
    checkValidFields(e.target.name)
  }

  const setValue = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value
      })
    },
    [formValues]
  )

  const fieldHasError = useCallback(
    (field: string): boolean => {
      return validFields[field] === undefined ? false : validFields[field]
    },
    [validFields]
  )

  const save = useCallback(async (): Promise<void> => {
    // validation error
    if (Object.values(validFields).filter((error) => error).length) return

    if (!checkValidFields('name', 'deadline', 'budget')) return

    setLoading(true)
    await createProject({ ...formValues } as CreateProjectDto)
      .then(() => {
        showToast('Project saved')
      })
      .catch(() => {
        showToast('Error saving', 'error')
      })
      .finally(() => setLoading(false))
  }, [validFields, formValues, showToast, checkValidFields])

  return (
    <ContentBlock title="Add Project">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            save()
          }}
        >
          <Grid container spacing={5}>
            <Grid item lg={8}>
              <TextField
                name="name"
                placeholder="Name"
                helperText="A project name used in proposals and listing"
                value={formValues['name'] || ''}
                onChange={setValue}
                error={fieldHasError('name')}
                onBlur={onBlur}
                required
                fullWidth
              />
              <TextField
                name="description"
                placeholder="Description"
                helperText="A project description to provide context to contributors and stakholders"
                value={formValues['description'] || ''}
                onChange={setValue}
                required
                multiline
                fullWidth
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                name="deadline"
                placeholder="Deadline"
                helperText="A completion date for this project"
                type="datetime-local"
                value={formValues['deadline'] || ''}
                onBlur={onBlur}
                error={fieldHasError('deadline')}
                onChange={setValue}
                required
                fullWidth
              />
              <TextField
                name="budget"
                placeholder="Budget"
                helperText="The budget requested"
                type="number"
                value={formValues['budget'] || ''}
                onChange={setValue}
                onBlur={onBlur}
                error={fieldHasError('budget')}
                required
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">$</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
          <Button sx={{ mt: 5 }} fullWidth variant="contained" onClick={() => save()}>
            Save
          </Button>
        </Box>
      )}
    </ContentBlock>
  )
}
