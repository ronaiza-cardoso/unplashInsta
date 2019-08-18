import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList } from 'react-native'

import { Post, Header, Avatar, Name, PostDescription, Loading } from './style'
import LazyImage from '../components/LazyImage';

export default function Feed () {
    const [feed, setFeed] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [refreshing, setReshing] = useState(false)
    const [viewable, setViewable] = useState([])

    async function loadPage(pageNumber = page, shouldRefresh = false) {
        if(total && pageNumber > total) return
        
        setLoading(true)

        const response = await fetch(
            'http://localhost:3000/feed?_expand=author&_limit=5&_page=' + pageNumber
        )
        const data = await response.json()
        const totalItems = response.headers.get('X-Total-Count')

        setTotal(Math.floor(totalItems/5))
        setFeed(shouldRefresh ? data : [...feed, ...data])
        setPage(pageNumber + 1)
        setLoading(false)
    }

    useEffect(() => {
        loadPage()
    }, [])

    async function refreshList () {
        setReshing(true)

        await loadPage(1, true)

        setReshing(false)
    }

    /*
     * FlatList just accept functions that are chached
     * because that we are using useCallback to memo this function
     */
    const handleVieablechanged = useCallback(({ changed }) => {
        setViewable(changed.map(({ item }) => item.id))
    }, [])

    return (
        <View>
            <FlatList 
                data={feed}
                keyExtractor={post => String(post.id)}
                onEndReached={() => loadPage()}
                onEndReachedThreshold={0.1}
                onRefresh={refreshList}
                refreshing={refreshing}
                onViewableItemsChanged={handleVieablechanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 20 }}
                ListFooterComponent={loading && <Loading/>}
                renderItem={({ item }) => (
                    <Post>
                        <Header>
                            <Avatar ratio={item.aspectRatio} source={{ uri: item.author.avatar }}/>
                            <Name>{item.author.name}</Name>
                        </Header>
                        <LazyImage
                            shouldLoad={viewable.includes(item.id)}
                            viewable={viewable}
                            aspectRatio={item.aspectRatio} 
                            source={{ uri: item.image }} 
                            smallSource={{ uri: item.small }}
                        />
                        <PostDescription>
                            <Name>{item.author.name}</Name> {item.description}
                        </PostDescription>
                    </Post>
                )}
            />
        </View>
    )
}
