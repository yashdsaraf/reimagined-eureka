/*
 * Copyright 2018 Pivotal Software, Inc..
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.tyit.pnc.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.DeveloperRepository;
import org.tyit.pnc.repository.PluginRepository;

/**
 *
 * @author Yash D. Saraf & Raees R. Mulla
 */
@Service
public class StatsService {
    
    @Autowired
    private PluginRepository pluginRepository;
    
    @Autowired
    private AppUserRepository appUserRepository;
    
    @Autowired
    private DeveloperRepository developerRepository;
    
    /**
     * returns a map of elements and their count
     * e.g 
     * {
     *   "users": 20,
     *   "plugins": 12,
     *   "developers": 10
     * }
     */
    public Map<String, Integer> getTotalCount() {
        Map<String, Integer> map = new HashMap<>();
        map.put("users", (int) appUserRepository.findAll().spliterator().getExactSizeIfKnown());
        map.put("plugins", (int) pluginRepository.findAll().spliterator().getExactSizeIfKnown());
        map.put("developers", (int) developerRepository.findAll().spliterator().getExactSizeIfKnown());
        return map;
    }

    /**
     * returns a list of lists with two elements
     * Month and No. of users created in that month
     * e.g
     * [
     *   ["January", "10"],
     *   ["March", "6"]
     * ]
     */
    public List<List<String>> getUserPerMonth() {
        List<List<String>> outerList = new ArrayList<>();
        Iterable<Object[]> usersPerMonths = appUserRepository.findCountPerMonths();
        for (Object[] item: usersPerMonths) {
           List<String> innerList = new ArrayList<>();
           innerList.add(item[0].toString().trim());
           innerList.add(item[1].toString().trim()); 
           outerList.add(innerList);
        }
        return outerList;
    }

    /**
     * returns a list of lists with two elements
     * Month and No. of plugins created in that month
     * e.g
     * [
     *   ["January", "10"],
     *   ["March", "6"]
     * ]
     */
    public List<List<String>> getPluginsPerMonth() {
        List<List<String>> outerList = new ArrayList<>();
        Iterable<Object[]> usersPerMonths = pluginRepository.findCountPerMonths();
        for (Object[] item: usersPerMonths) {
           List<String> innerList = new ArrayList<>();
           innerList.add(item[0].toString().trim());
           innerList.add(item[1].toString().trim()); 
           outerList.add(innerList);
        }
        return outerList;
    }

    /**
     * returns a list of lists with two elements
     * Plugin name and No. of times the plugin has been installed out of 100
     * e.g
     * [
     *   ["Java", "60"],
     *   ["Python", "50"],
     *   ["PHP", "10"]
     * ]
     * NOTE: Plugins with 0 installs are discarded.
     */
    public List<List<String>> getPluginsPerInstalls() {
        List<List<String>> outerList = new ArrayList<>();
        Iterable<Plugin> plugins = pluginRepository.findAllApproved();
        for (Plugin plugin: plugins) {
           List<String> innerList = new ArrayList<>();
           int count =  plugin.getAppUserCollection().size();
           innerList.add(plugin.getName());
           innerList.add(String.valueOf(count));
           outerList.add(innerList);
        }        
        // filter out all the lists with count 0
        outerList = outerList.stream()
                        .filter(i -> Double.parseDouble(i.get(1)) > 0)
                        .collect(Collectors.toList());
       
        return outerList;
    }
}
