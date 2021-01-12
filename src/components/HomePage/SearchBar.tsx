import React, { useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Paper, InputBase, Divider } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: "2px 4px",
			display: "flex",
			alignItems: "center",
			backgroundColor: theme.palette.type === "dark" ? theme.palette.grey[900] : "#fff",
		},
		input: {
			marginLeft: theme.spacing(1),
			flex: 1,
		},
		iconButton: {
			padding: 10,
		},
		divider: {
			height: 28,
			margin: 4,
		},
	})
)

export type SearchBarProps = {
	fetchRepositories: (searchKey: string) => void;
	clearRepositories: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
	fetchRepositories,
	clearRepositories,
}) => {
	const [searchKey, setSearchKey] = useState<string>("")

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchKey(e.target.value)
	}

	const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		fetchRepositories(searchKey)
	}

	const onClear = () => {
		setSearchKey("")
		clearRepositories()
	}

	const classes = useStyles()

	return (
		<Paper component="form" className={classes.root} elevation={9}>
			<InputBase
				className={classes.input}
				inputProps={{ "aria-label": "search repositories in github" }}
				name="search"
				type="text"
				placeholder="Enter repository name"
				value={searchKey}
				onChange={onChange}
				color="secondary"
				fullWidth
			/>
			<IconButton
				type="submit"
				className={classes.iconButton}
				aria-label="search"
				onClick={onSubmit}
			>
				<SearchIcon />
			</IconButton>
			<Divider className={classes.divider} orientation="vertical" />
			<IconButton
				color="primary"
				className={classes.iconButton}
				aria-label="clear repositories"
				onClick={onClear}
			>
				<ClearIcon />
			</IconButton>
		</Paper>
	)
}

export default SearchBar
