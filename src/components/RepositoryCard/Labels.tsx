import React, { useState, useContext } from "react"
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles"
import { Button, Paper } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import LabelChip from "./LabelChip"
import { Label } from "../../utils/types"
import { AuthenticationContext } from "../../App"

export type LabelsProps = {
	labels: Label[];
	inSettingsPage: boolean;
	subscribe: (labels: Label[]) => Promise<boolean>;
	unsubscribe: (labels: Label[], isSelectAll: boolean) => Promise<boolean>;
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

const Labels: React.FC<LabelsProps> = ({
	labels,
	inSettingsPage,
	subscribe,
	unsubscribe,
}) => {

    const [selectableLabels, setSelectableLabels] = useState<Label[]>(labels)
    const [selectedLabelsCount, setSelectedLabelsCount] = useState<number>(0)
    const [subscribedLabelsCount, setSubscribedLabelsCount] = useState<number>(labels.filter(l => l.subscribed).length)
    const isSelectAll = selectedLabelsCount === selectableLabels.length - subscribedLabelsCount
    const isSubscribedToAll = subscribedLabelsCount === labels.length

	const classes = useStyles({selected: isSelectAll})
	
	const { isAuthenticated } = useContext(AuthenticationContext)

	const handleSelection = (data: Label) => () => {
		const index: number = selectableLabels.findIndex(l => l.name === data.name)
		let newSelectableLabels = selectableLabels.filter(l => l.name !== data.name)
		newSelectableLabels.splice(index, 0, { ...data, selected: !data.selected })
		setSelectedLabelsCount(prev => prev + (data.selected ? -1 : 1))
		setSelectableLabels(newSelectableLabels)
	}

	const handleClearSelection = () => {
		const newSelectableLabels = selectableLabels.map(l => ({ ...l, selected: false }))
		setSelectableLabels(newSelectableLabels)
		setSelectedLabelsCount(0)
	}

	
	const handleSelectAllLabels = () => {
		if (isSelectAll) {
			handleClearSelection()
		} else {
            const newSelectableLabels = selectableLabels.map(l => ({ ...l, selected: !l.subscribed && true }))
			setSelectableLabels(newSelectableLabels)
			setSelectedLabelsCount(newSelectableLabels.length - subscribedLabelsCount)
		}
	}
	
	const subscribeToSelectedLabels = () => {
		const selectedLabels = selectableLabels.filter(l => l.selected)
		const selectedLabelsName = selectedLabels.map(l => l.name)
        subscribe(selectedLabels)
            .then(res => {
                if (res) {
					const newSelectableLabels = selectableLabels.map(l => ({ 
						...l, 
						selected: false, 
						subscribed: l.subscribed || selectedLabelsName.includes(l.name) 
					}))
                    
                    setSelectableLabels(newSelectableLabels)
                    setSubscribedLabelsCount(prev => prev + selectedLabels.length)
					setSelectedLabelsCount(0)
                }
            })
	}

	const unsubscribeToSelectedLabels = () => {
		const selectedLabels = selectableLabels.filter(l => l.selected)
		const selectedLabelsName = selectedLabels.map(l => l.name)
		unsubscribe(selectedLabels, isSelectAll)
			.then(res => {
				if (res) {
					const newSelectableLabels = selectableLabels.filter(l => !selectedLabelsName.includes(l.name))
					
					setSelectableLabels(newSelectableLabels)
					setSubscribedLabelsCount(prev => prev - selectedLabels.length)
					setSelectedLabelsCount(0)
				}
			})
	}

	return (
		<div>
			{isAuthenticated && <Paper component="div" className={classes.actionButtons} elevation={0}>
				{!isSubscribedToAll && <Button
					variant={isSelectAll ? "contained" : "outlined"}
					className={classes.selectAllButton}
					startIcon={isSelectAll ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
					size="small"
					onClick={handleSelectAllLabels}
				>
					{isSelectAll ? "Unselect" : "Select"} All 
				</Button>}
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
			</Paper>}
			<Paper component="ul" className={classes.root} elevation={0}>
				{selectableLabels.map(l => (
					<LabelChip
						key={l.name}
						{...l}
						inSettingsPage={inSettingsPage}
						onDelete={isAuthenticated ? handleSelection(l) : undefined}
					/>
				))}
			</Paper>
			{isAuthenticated && selectedLabelsCount > 0 && (
				<Paper component="div" className={classes.actionButtons} elevation={0}>
					<Button
						variant="contained"
						className={classes.subscribeButton}
						startIcon={<PlaylistAddCheckIcon />}
						size="small"
						onClick={inSettingsPage ? unsubscribeToSelectedLabels : subscribeToSelectedLabels}
					>
						{inSettingsPage ? "Unsubscribe" : "Subscribe"} to {selectedLabelsCount} Labels
					</Button>
				</Paper>
			)}
		</div>
	);
};



export default Labels;
