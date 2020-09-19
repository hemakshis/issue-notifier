import React, { useState } from "react"
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles"
import { Button, Paper, Chip } from "@material-ui/core"
import NotificationsIcon from "@material-ui/icons/Notifications"
import CancelIcon from '@material-ui/icons/Cancel'
import DeleteIcon from "@material-ui/icons/Delete"
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'

export type Label = {
	name: string;
	color: string;
	selected: boolean
}

export type LabelsProp = {
	labels: Label[];
	subscribe: (labels: Label[]) => void
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			justifyContent: "center",
			flexWrap: "wrap",
			listStyle: "none",
			padding: theme.spacing(0.5),
			margin: 0,
			backgroundColor:
				theme.palette.type === "dark" ? theme.palette.grey[900] : "#fff",
			alignItems: "center",
		},
		actionButtons: {
			backgroundColor:
				theme.palette.type === "dark" ? theme.palette.grey[900] : "#fff",
			display: "flex",
			justifyContent: "flex-end",
			"& button": {
				margin: theme.spacing(1),
				fontFamily: "Roboto Mono, monospace",
				textTransform: "capitalize",
			},
		},
		clearIcon: {
			color: "#c62828"
		},
		subscribeButton: {
			backgroundColor: theme.palette.augmentColor({ main: "#0d47a1" }).main,
			color: "#fff",
			"&:hover": {
				backgroundColor: theme.palette.augmentColor({ main: "#0d47a1" }).dark,
			}
		},
		selectAllButton: ({selected}: {selected: boolean}) => ({
			backgroundColor: !selected ? theme.palette.type === "dark" ? "#2e2e2e" : "#fff" : "#2e2e2e",
			borderColor: !selected && theme.palette.type === "dark" ? "#fff" : "#2e2e2e",
			color: selected ? "#fff" : theme.palette.type === "dark" ? "#fff" : "#2e2e2e",

			"&:hover": {
				backgroundColor: theme.palette.grey["A400"],
				color: "#fff",
			},
		}),
	})
);

const useLabelStyles = makeStyles((theme: Theme) => ({
	notificationIcon: ({ color }: { color: string }) => ({
		color: theme.palette.augmentColor({ main: "#" + color }).main,
		"&:hover": {
			color: theme.palette.augmentColor({ main: "#" + color }).dark
		}
	}),
	chip: ({ color, selected }: { color: string; selected: boolean }) => ({
		backgroundColor: selected
			? "#" + color
			: theme.palette.type === "dark"
				? theme.palette.grey[900]
				: "#fff",
		margin: theme.spacing(0.5),
		borderColor: theme.palette.augmentColor({ main: "#" + color }).main,
		color: !selected
			? theme.palette.type !== "dark" ? theme.palette.grey[900] : "#fff"
			: theme.palette.getContrastText(theme.palette.augmentColor({ main: "#" + color })[theme.palette.type]),
	}),
}));

const Labels: React.FC<LabelsProp> = ({
	labels,
	subscribe
}) => {

	const [labelsState, setLabelsState] = useState<Label[]>(labels);
	const [selectedLabelsCount, setSelectedLabelsCount] = useState<number>(0);
	
	const isSelectAll = selectedLabelsCount === labels.length

	const classes = useStyles({selected: isSelectAll})

	const handleSelection = (data: Label) => () => {
		const index: number = labelsState.findIndex((l: Label) => l.name === data.name)
		let newLabelsState: Label[] = labelsState.filter((l: Label) => l.name !== data.name)
		newLabelsState.splice(index, 0, { ...data, selected: !data.selected })
		setSelectedLabelsCount(prev => prev + (data.selected ? -1 : 1))
		setLabelsState(newLabelsState)
	};

	const handleClearSelection = () => {
		const newLabelsState: Label[] = labelsState.map((l: Label) => ({ ...l, selected: false }))
		setLabelsState(newLabelsState)
		setSelectedLabelsCount(0)
	}

	
	const handleSelectAllLabels = () => {
		if (isSelectAll) {
			handleClearSelection()
		} else {
			const newLabelsState: Label[] = labelsState.map((l: Label) => ({ ...l, selected: true }))
			setLabelsState(newLabelsState)
			setSelectedLabelsCount(newLabelsState.length)
		}
		console.log(isSelectAll)
	}
	
	const subscribeToSelectedLabels = () => {
		subscribe(labelsState.filter((l: Label) => l.selected));
	}

	return (
		<div>
			<Paper component="div" className={classes.actionButtons} elevation={0}>
				<Button
					variant={isSelectAll ? "contained" : "outlined"}
					className={classes.selectAllButton}
					startIcon={isSelectAll ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
					size="small"
					onClick={handleSelectAllLabels}
				>
					Select All 
				</Button>
				{(!isSelectAll && selectedLabelsCount > 0) && (
					<Button
						className="clearButton"
						startIcon={<DeleteIcon className={classes.clearIcon} />}
						size="small"
						onClick={handleClearSelection}
					>
						Clear
					</Button>
				)}
			</Paper>
			<Paper component="ul" className={classes.root} elevation={0}>
				{labelsState.map((data: Label) => (
					<LabelChip
						key={data.name}
						{...data}
						selected={data.selected}
						onDelete={handleSelection(data)}
					/>
				))}
			</Paper>
			{selectedLabelsCount > 0 && (
				<Paper component="div" className={classes.actionButtons} elevation={0}>
					<Button
						variant="contained"
						className={classes.subscribeButton}
						startIcon={<PlaylistAddCheckIcon />}
						size="small"
						onClick={subscribeToSelectedLabels}
					>
						Subscribe to {selectedLabelsCount} Labels
					</Button>
				</Paper>
			)}
		</div>
	);
};

export const LabelChip: React.FC<Label & { onDelete: (data: Label) => void }> = ({
	name,
	color,
	selected,
	onDelete,
}) => {
	const labelStyle = useLabelStyles({ color, selected });

	return (
		<li key={name}>
			<Chip
				label={name}
				className={labelStyle.chip}
				variant={selected ? "default" : "outlined"}
				onDelete={onDelete}
				size={selected ? "small" : "medium"}
				deleteIcon={
					!selected ? (
						<NotificationsIcon className={labelStyle.notificationIcon} />
					) : (
							<CancelIcon />
						)
				}
			/>
		</li>
	);
}

export default Labels;
