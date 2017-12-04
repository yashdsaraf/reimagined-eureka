/*
 * Copyright 2017 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
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
package org.tyit.pnc.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Entity
@Table(name = "PLUGIN")
@NamedQueries({
  @NamedQuery(name = "Plugin.findAll", query = "SELECT p FROM Plugin p")})
public class Plugin implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @Basic(optional = false)
  @NotNull
  @Column(name = "ID")
  private Long id;
  @Basic(optional = false)
  @NotNull
  @Size(min = 1, max = 255)
  @Column(name = "NAME")
  private String name;
  @Size(max = 500)
  @Column(name = "DESCRIPTION")
  private String description;
  @Basic(optional = false)
  @NotNull
  @Size(min = 1, max = 3)
  @Column(name = "STATUS")
  private String status;
  @Basic(optional = false)
  @NotNull
  @Lob
  @Column(name = "PLUGIN_FILE")
  private String pluginFile;
  @Basic(optional = false)
  @NotNull
  @Column(name = "CREATED_ON")
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdOn;
  @Basic(optional = false)
  @NotNull
  @Column(name = "UPDATED_ON")
  @Temporal(TemporalType.TIMESTAMP)
  private Date updatedOn;
  @JoinTable(name = "USER_PLUGIN", joinColumns = {
    @JoinColumn(name = "PLUGIN_ID", referencedColumnName = "ID")}, inverseJoinColumns = {
    @JoinColumn(name = "USER_ID", referencedColumnName = "ID")})
  @ManyToMany
  private Collection<User> userCollection;
  @JoinColumn(name = "DEVELOPER_ID", referencedColumnName = "ID")
  @ManyToOne(optional = false)
  private DeveloperDetails developerId;

  public Plugin() {
  }

  public Plugin(Long id) {
    this.id = id;
  }

  public Plugin(Long id, String name, String status, String pluginFile, Date createdOn, Date updatedOn) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.pluginFile = pluginFile;
    this.createdOn = createdOn;
    this.updatedOn = updatedOn;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getPluginFile() {
    return pluginFile;
  }

  public void setPluginFile(String pluginFile) {
    this.pluginFile = pluginFile;
  }

  public Date getCreatedOn() {
    return createdOn;
  }

  public void setCreatedOn(Date createdOn) {
    this.createdOn = createdOn;
  }

  public Date getUpdatedOn() {
    return updatedOn;
  }

  public void setUpdatedOn(Date updatedOn) {
    this.updatedOn = updatedOn;
  }

  public Collection<User> getUserCollection() {
    return userCollection;
  }

  public void setUserCollection(Collection<User> userCollection) {
    this.userCollection = userCollection;
  }

  public DeveloperDetails getDeveloperId() {
    return developerId;
  }

  public void setDeveloperId(DeveloperDetails developerId) {
    this.developerId = developerId;
  }

  @Override
  public int hashCode() {
    int hash = 0;
    hash += (id != null ? id.hashCode() : 0);
    return hash;
  }

  @Override
  public boolean equals(Object object) {
    // TODO: Warning - this method won't work in the case the id fields are not set
    if (!(object instanceof Plugin)) {
      return false;
    }
    Plugin other = (Plugin) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "org.tyit.pnc.model.Plugin[ id=" + id + " ]";
  }

}
