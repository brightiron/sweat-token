import { Fab, Paper, SxProps, Theme } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'
import { Add } from '@mui/icons-material'
import { useNavigate } from 'react-router'

interface ContentBlockProps {
  title?: string
  children?: ReactNode
  cta?: {
    text: string
    href: string
  }
  sx?: SxProps<Theme>
}

export default function ContentBlock(props: ContentBlockProps) {
  const { title, children, sx, cta } = props
  const navigate = useNavigate()
  return (
    <Paper
      sx={
        sx || {
          p: 2,
          mb: 2
        }
      }
    >
      <Box display={'flex'}>
        {title && <h2>{title}</h2>}
        {cta?.href && (
          <Fab
            sx={{ margin: '10px 0 0 auto', order: 2 }}
            variant="extended"
            color="primary"
            onClick={() => navigate(cta?.href)}
            data-testid="cta-button"
          >
            <Add />
            {cta?.text}
          </Fab>
        )}
      </Box>
      {children ? <Box>{children}</Box> : <></>}
    </Paper>
  )
}
