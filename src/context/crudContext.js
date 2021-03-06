import React, { Component, createContext } from 'react';
import { UserContext } from './userContext';

export const CrudContext = createContext({});

export class CrudProvider extends Component {
    static contextType = UserContext;
    url = "https://mealworm-api.web.app/api";

    setCookbookState = () => {
            fetch(`${this.url}/favourites/${this.context.user.uid}`)
            .then(response => response.json())
            .then(({
                recipes
            }) => {
                const favourites = recipes.map(recipe => ({
                    ...recipe,
                    isFav: true
                }))
                this.setState({
                    favourites,
                    content: true
                })
            })
    };

    addToCookbook = (recipe) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...recipe,
                userId: this.context.user.uid
            })
        };
        fetch(`${this.url}/recipes`, requestOptions)
            .then(response => {
                return response.json();
            })
            .then((data) => this.setCookbookState());
    };

    removeFromCookbook = (recipe) => {
        const requestOptions = {
            method: 'DELETE'
        };
        fetch(`${this.url}/recipes/${recipe.id}`, requestOptions)
            .then(response => response.json())
            .then(this.setCookbookState);
    };

    toggleFav = (recipe) => {
        if (this.context.user) {
            recipe.isFav = !recipe.isFav;
            recipe.isFav
                ? this.addToCookbook(recipe)
                : this.removeFromCookbook(recipe);
        } else {
            alert(
                "You must be logged in to edit your cookbook. Please click the google icon to sign in with your gmail account."
            );
        }
    };

    componentDidUpdate() {
        if (!this.state.content && this.context.user) {
            this.setCookbookState();
        }
    }

    state = {
        favourites: [],
        toggleFav: this.toggleFav,
        addToCookbook: this.addToCookbook,
        content: false
    }

    render() {
        return (<CrudContext.Provider value={this.state}>{this.props.children}</CrudContext.Provider>);
    }
}